# OliverSEO Business Desktop App

A desktop application for managing your OliverSEO business, including the Dashboard and Reddit Outreach Tool.

## Installation

### Option 1: Install from Source (Recommended)

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Install the LTS version

2. **Open Terminal/Command Prompt** in this folder

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the App**
   ```bash
   npm start
   ```

### Option 2: Build Installer (Windows)

1. **Install Dependencies** (same as above)
   ```bash
   npm install
   ```

2. **Build the Installer**
   ```bash
   npm run build
   ```

3. **Find the Installer**
   - Look in the `dist` folder
   - Run the `.exe` installer
   - Follow the installation wizard

## Features

- **Dashboard**: Access all your business documents and guides
- **Reddit Outreach Tool**: Automate your Reddit outreach workflow
- **Daily Sale Tracker**: Track your daily sales and proposals
- **Offline Access**: Works without internet (except Reddit API features)
- **Auto-save**: All data is saved locally

## Keyboard Shortcuts

- `Ctrl+D` (or `Cmd+D` on Mac): Open Dashboard
- `Ctrl+R` (or `Cmd+R` on Mac): Open Reddit Outreach Tool
- `Ctrl+Q` (or `Cmd+Q` on Mac): Quit Application
- `F11`: Toggle Fullscreen
- `Ctrl+Shift+I`: Open Developer Tools

## Troubleshooting

### App won't start
- Make sure Node.js is installed: `node --version`
- Try deleting `node_modules` folder and running `npm install` again

### Reddit Post Finder not working
- This is due to CORS restrictions from Reddit
- Use the direct links in the "Subreddits" tab instead

### Data not saving
- Check that you have write permissions in the app folder
- Data is stored in browser localStorage

## Uninstall

1. **Windows**: Use "Add or Remove Programs"
2. **Mac**: Drag app to Trash
3. **Linux**: Remove the app folder

## Support

For issues or questions, check the GitHub repository:
https://github.com/oliver273/oliverseosite



