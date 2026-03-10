const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
};

// Helper to update config.js safely
function updateConfig(updater) {
    const configPath = path.join(__dirname, 'config.js');
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Match the CONFIG object assignment
    const match = content.match(/const\s+CONFIG\s*=\s*({[\s\S]*});?/);
    if (!match) return false;
    
    let objStr = match[1];
    let configObj;
    // Safely evaluate the JS object (handles unquoted keys/comments in existing file)
    eval('configObj = ' + objStr);
    
    // Apply our updates
    updater(configObj);
    
    // Write back correctly formatted
    const newContent = content.replace(match[0], 'const CONFIG = ' + JSON.stringify(configObj, null, 4) + ';');
    fs.writeFileSync(configPath, newContent, 'utf8');
    return true;
}

const server = http.createServer((req, res) => {
    // API endpoint: Update Password
    if (req.method === 'POST' && req.url === '/api/update-password') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { username, newPasswordBase64 } = JSON.parse(body);
                
                const success = updateConfig((config) => {
                    const user = config.users.find(u => u.username.toLowerCase() === username.toLowerCase());
                    if (user) {
                        user.password = newPasswordBase64;
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success, message: success ? 'Password Updated!' : 'Config parsing failed.' }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    // API endpoint: Update Score
    if (req.method === 'POST' && req.url === '/api/update-score') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { username, testId, score } = JSON.parse(body);
                
                const success = updateConfig((config) => {
                    const user = config.users.find(u => u.username.toLowerCase() === username.toLowerCase());
                    if (user) {
                        if (!user.scores) user.scores = {};
                        user.scores[testId] = score;
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    // Serve all static frontend files
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found (File missing)', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`Backend Server Started!`);
    console.log(`Live at: http://localhost:${PORT}`);
    console.log(`================================\n`);
});
