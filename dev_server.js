const http = require('http');
const fs = require('fs');
const path = require('path');
const apiHandler = require('./api/[...rest].js');

const PORT = process.env.PORT || 3003;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  // 1. Route API requests
  if (url.startsWith('/api/') || url === '/api') {
    return apiHandler(req, res);
  }

  // 2. Static file serving
  let filePath = path.join(ROOT_DIR, url === '/' ? 'index.html' : url);

  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  } catch (err) {
    // If not found, try serving index.html for SPA behavior
    try {
      const indexFile = path.join(ROOT_DIR, 'index.html');
      const content = fs.readFileSync(indexFile);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    } catch (e) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`[Flor De Gema Dev Server] Corriendo en http://localhost:${PORT}`);
  console.log(`[Flor De Gema Dev Server] API & Neon conectadas en http://localhost:${PORT}/api/status`);
});
