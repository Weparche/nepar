// Minimal static file server mimicking Cloudflare Pages clean-URL resolution:
// for an extensionless path, try exact file, then path+'.html', then path+'/index.html'.
// Used only for local evidence-gathering; not part of the app.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'dist');
const PORT = 4174;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[\/\\])+/, '');
  return path.join(root, normalized);
}

function tryServe(res, filePath) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return false2();
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return true;
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const base = safeJoin(ROOT, urlPath);

  const candidates = [];
  if (!path.extname(base)) {
    candidates.push(base + '.html');
    candidates.push(path.join(base, 'index.html'));
  }
  candidates.push(base);

  function attempt(i) {
    if (i >= candidates.length) {
      const notFound = path.join(ROOT, '404.html');
      fs.readFile(notFound, (err, data) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(err ? 'Not found' : data);
      });
      return;
    }
    const candidate = candidates[i];
    fs.stat(candidate, (err, stat) => {
      if (!err && stat.isFile()) {
        const ext = path.extname(candidate).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(candidate).pipe(res);
      } else {
        attempt(i + 1);
      }
    });
  }
  attempt(0);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static server with clean URLs running at http://127.0.0.1:${PORT}`);
});
