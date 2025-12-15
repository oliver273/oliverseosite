const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Suppress GPU process errors (common on Windows, harmless)
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu');
// Allow insecure localhost connections for Ollama
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

// Suppress console errors for GPU process crashes
process.on('uncaughtException', (error) => {
  if (error.message && error.message.includes('GPU process')) {
    // Silently ignore GPU process errors
    return;
  }
  console.error('Uncaught Exception:', error);
});

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // Disable web security to allow CORS requests
      // Allow localhost connections for Ollama
      allowRunningInsecureContent: false
    },
    // icon: path.join(__dirname, 'icon.png'), // Uncomment and add icon.png for custom icon
    show: false // Don't show until ready
  });

  // Suppress GPU process error messages
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    // Ignore GPU-related errors
    if (errorDescription && errorDescription.includes('GPU')) {
      return;
    }
  });

  // Load the dashboard
  mainWindow.loadFile('dashboard-fixed.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.loadFile('dashboard-fixed.html');
          }
        },
        {
          label: 'Reddit Outreach Tool',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.loadFile('reddit-outreach-tool.html');
          }
        },
        {
          label: 'AI Assistant',
          accelerator: 'CmdOrCtrl+A',
          click: () => {
            mainWindow.loadFile('reddit-outreach-tool.html').then(() => {
              setTimeout(() => {
                mainWindow.webContents.executeJavaScript(`
                  document.querySelectorAll('.tab').forEach(tab => {
                    if (tab.textContent.includes('AI Assistant')) {
                      tab.click();
                    }
                  });
                `);
              }, 500);
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Dashboard',
          click: () => {
            mainWindow.loadFile('dashboard-fixed.html');
          }
        },
        {
          label: 'Reddit Outreach Tool',
          click: () => {
            mainWindow.loadFile('reddit-outreach-tool.html');
          }
        },
        {
          label: 'AI Assistant',
          click: () => {
            mainWindow.loadFile('reddit-outreach-tool.html').then(() => {
              setTimeout(() => {
                mainWindow.webContents.executeJavaScript(`
                  document.querySelectorAll('.tab').forEach(tab => {
                    if (tab.textContent.includes('AI Assistant')) {
                      tab.click();
                    }
                  });
                `);
              }, 500);
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Daily Sale Tracker',
          click: () => {
            mainWindow.loadFile('daily_sale_tracker.html');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            shell.openExternal('https://github.com/oliver273/oliverseosite');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

