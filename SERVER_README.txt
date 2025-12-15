========================================
OliverSEO Local Server - Quick Start
========================================

WHY USE A LOCAL SERVER?
-----------------------
The viewer needs a local server to load markdown files due to browser security (CORS).
This is normal and safe - it just serves files from your computer.

OPTION 1: Python Server (Recommended)
---------------------------------------
1. Make sure Python is installed (check: python --version)
2. Double-click: START_SERVER.bat
3. Browser will open automatically
4. Press Ctrl+C to stop

OPTION 2: Node.js Server
-------------------------
1. Make sure Node.js is installed (check: node --version)
2. Double-click: START_SERVER_NODE.bat
3. Browser will open automatically
4. Press Ctrl+C to stop

WHAT HAPPENS?
-------------
- Server starts on http://localhost:8000
- Dashboard opens automatically
- All files load correctly (no CORS errors)
- Safe - only serves files from your computer

TROUBLESHOOTING
---------------
- Port 8000 already in use?
  → Close other programs using port 8000
  → Or edit start_server.py/js and change PORT = 8000 to another number

- Python/Node not found?
  → Install Python from https://www.python.org/
  → Or install Node.js from https://nodejs.org/

- Still having issues?
  → Make sure you're in the OliverSEO_Site_Ready folder
  → Check that dashboard-fixed.html exists

========================================
That's it! Just double-click START_SERVER.bat
========================================


