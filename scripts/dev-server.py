#!/usr/bin/env python3
"""Serve the OliverSEO static site for local development.

Launch from the repository root. Listens on 0.0.0.0:$PORT (default 3000).
Extensionless URLs such as /services map to the matching HTML file, simple
Netlify _redirects rules are applied, and unknown paths return 404.html.
"""

from __future__ import annotations

import mimetypes
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "3000"))


def find_root() -> Path:
    cwd = Path.cwd()
    if (cwd / "index.html").is_file():
        return cwd
    here = Path(__file__).resolve().parent
    for candidate in (here, here.parent):
        if (candidate / "index.html").is_file():
            return candidate
    print("index.html not found; start this server from the site root", file=sys.stderr)
    sys.exit(1)


ROOT = find_root()


def load_redirects(root: Path) -> list[tuple[str, str, int]]:
    path = root / "_redirects"
    rules: list[tuple[str, str, int]] = []
    if not path.is_file():
        return rules
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) < 2:
            continue
        status = int(parts[2]) if len(parts) >= 3 and parts[2].isdigit() else 301
        rules.append((parts[0], parts[1], status))
    return rules


REDIRECTS = load_redirects(ROOT)


def safe_path(rel: str) -> Path | None:
    candidate = (ROOT / rel).resolve()
    try:
        candidate.relative_to(ROOT)
    except ValueError:
        return None
    return candidate


class SiteHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self) -> None:
        self._handle()

    def do_HEAD(self) -> None:
        self._handle()

    def _handle(self) -> None:
        parsed = urlparse(self.path)
        raw_path = unquote(parsed.path)
        trimmed = raw_path.rstrip("/") or "/"

        for src, dest, status in REDIRECTS:
            src_trim = src.rstrip("/") or "/"
            if trimmed == src_trim:
                self.send_response(status)
                self.send_header("Location", dest)
                self.send_header("Content-Length", "0")
                self.end_headers()
                return

        rel = "" if trimmed == "/" else trimmed.lstrip("/")
        if rel == "":
            target = safe_path("index.html")
            if target is not None and target.is_file():
                self._send_file(target, 200)
                return
        else:
            target = safe_path(rel)
            if target is not None and target.is_file():
                self._send_file(target, 200)
                return
            if target is not None and target.is_dir():
                index = safe_path(str(Path(rel) / "index.html"))
                if index is not None and index.is_file():
                    self._send_file(index, 200)
                    return
            html = safe_path(rel + ".html")
            if html is not None and html.is_file():
                self._send_file(html, 200)
                return

        not_found = safe_path("404.html")
        if not_found is not None and not_found.is_file():
            self._send_file(not_found, 404)
            return
        self.send_error(404, "Not found")

    def _send_file(self, path: Path, status: int) -> None:
        data = path.read_bytes()
        ctype = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), SiteHandler)
    print(f"Serving {ROOT} at http://{HOST}:{PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
