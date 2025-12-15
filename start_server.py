#!/usr/bin/env python3
"""
Simple HTTP server for OliverSEO Dashboard
Solves CORS issues when viewing markdown files
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.absolute()
PORT = 8000

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP Request Handler with CORS support"""
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle OPTIONS request for CORS preflight"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{self.address_string()}] {format % args}")

def main():
    # Change to the script directory
    os.chdir(SCRIPT_DIR)
    
    print("=" * 60)
    print("🚀 OliverSEO Local Server")
    print("=" * 60)
    print(f"📁 Serving from: {SCRIPT_DIR}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print(f"📄 Dashboard: http://localhost:{PORT}/dashboard-fixed.html")
    print("=" * 60)
    print("\n💡 Press Ctrl+C to stop the server\n")
    
    # Create server
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        try:
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}/dashboard-fixed.html')
                print("✅ Browser opened automatically!")
            except:
                print("⚠️  Could not open browser automatically")
                print(f"   Please open: http://localhost:{PORT}/dashboard-fixed.html")
            
            print("\n🔄 Server is running...\n")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            print("👋 Goodbye!")

if __name__ == "__main__":
    main()


