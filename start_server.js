/**
 * Simple HTTP server for OliverSEO Dashboard
 * Solves CORS issues when viewing markdown files
 * 
 * Run with: node start_server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;
const DIRECTORY = __dirname;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './dashboard-fixed.html';
    }

    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read file
    fs.readFile(path.join(DIRECTORY, filePath), (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 OliverSEO Local Server');
    console.log('='.repeat(60));
    console.log(`📁 Serving from: ${DIRECTORY}`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📄 Dashboard: http://localhost:${PORT}/dashboard-fixed.html`);
    console.log('='.repeat(60));
    console.log('\n💡 Press Ctrl+C to stop the server\n');

    // Try to open browser
    const url = `http://localhost:${PORT}/dashboard-fixed.html`;
    const command = process.platform === 'win32' 
        ? `start ${url}` 
        : process.platform === 'darwin' 
        ? `open ${url}` 
        : `xdg-open ${url}`;

    exec(command, (error) => {
        if (error) {
            console.log('⚠️  Could not open browser automatically');
            console.log(`   Please open: ${url}`);
        } else {
            console.log('✅ Browser opened automatically!');
        }
    });

    console.log('🔄 Server is running...\n');
});


