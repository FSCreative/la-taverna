// La Taverna VIII – static server + admin image API (zero dependencies)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const IMAGES_FILE = path.join(DATA_DIR, 'images.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'taverna2026';
const MAX_BODY = 9 * 1024 * 1024; // 9 MB

// valid swappable image keys
const KEYS = new Set(['logo','hero_bg','about','order_bg','gallery_1','gallery_2','gallery_3','gallery_4','gallery_5','gallery_6']);

// ensure data dirs exist
try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch (e) {}

function readImages() {
  try { return JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8')); }
  catch (e) { return {}; }
}
function writeImages(obj) {
  fs.writeFileSync(IMAGES_FILE, JSON.stringify(obj, null, 2));
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json'
};
const EXT_FOR_MIME = {
  'image/png': '.png', 'image/jpeg': '.jpg', 'image/jpg': '.jpg',
  'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg'
};

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8' });
  res.end(body);
}
function sendJson(res, code, obj) { send(res, code, JSON.stringify(obj)); }

function collectBody(req, cb) {
  let chunks = [], size = 0, aborted = false;
  req.on('data', d => {
    if (aborted) return;
    size += d.length;
    if (size > MAX_BODY) { aborted = true; cb(new Error('too_large')); req.destroy(); return; }
    chunks.push(d);
  });
  req.on('end', () => { if (!aborted) cb(null, Buffer.concat(chunks)); });
  req.on('error', () => { if (!aborted) cb(new Error('stream_error')); });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  // ---- API ----
  if (urlPath === '/api/images' && req.method === 'GET') {
    return sendJson(res, 200, readImages());
  }

  if (urlPath === '/api/login' && req.method === 'POST') {
    return collectBody(req, (err, buf) => {
      if (err) return sendJson(res, 400, { error: 'bad_request' });
      let pw = '';
      try { pw = (JSON.parse(buf.toString('utf8')) || {}).password || ''; } catch (e) {}
      if (pw === ADMIN_PASSWORD) return sendJson(res, 200, { ok: true });
      return sendJson(res, 401, { error: 'invalid' });
    });
  }

  if (urlPath === '/api/images' && (req.method === 'POST' || req.method === 'DELETE')) {
    if ((req.headers['x-admin-key'] || '') !== ADMIN_PASSWORD)
      return sendJson(res, 401, { error: 'unauthorized' });
    return collectBody(req, (err, buf) => {
      if (err) return sendJson(res, err.message === 'too_large' ? 413 : 400, { error: err.message });
      let body = {};
      try { body = JSON.parse(buf.toString('utf8')) || {}; } catch (e) { return sendJson(res, 400, { error: 'bad_json' }); }
      const key = body.key;
      if (!KEYS.has(key)) return sendJson(res, 400, { error: 'bad_key' });
      const images = readImages();

      // reset to default
      if (req.method === 'DELETE' || body.reset) {
        delete images[key];
        writeImages(images);
        return sendJson(res, 200, { ok: true, key, url: null });
      }

      // hide / delete completely (image won't show on the site)
      if (body.hide) {
        images[key] = '__hidden__';
        writeImages(images);
        return sendJson(res, 200, { ok: true, key, url: '__hidden__' });
      }

      // set via plain URL
      if (body.url && /^https?:\/\//i.test(body.url)) {
        images[key] = body.url;
        writeImages(images);
        return sendJson(res, 200, { ok: true, key, url: body.url });
      }

      // set via uploaded data URL (base64)
      if (body.dataUrl && /^data:/i.test(body.dataUrl)) {
        const m = body.dataUrl.match(/^data:([^;]+);base64,(.*)$/);
        if (!m) return sendJson(res, 400, { error: 'bad_data' });
        const mime = m[1].toLowerCase();
        const ext = EXT_FOR_MIME[mime];
        if (!ext) return sendJson(res, 400, { error: 'unsupported_type' });
        const data = Buffer.from(m[2], 'base64');
        const fname = key + '_' + Date.now() + ext;
        try { fs.writeFileSync(path.join(UPLOAD_DIR, fname), data); }
        catch (e) { return sendJson(res, 500, { error: 'write_failed' }); }
        const url = '/uploads/' + fname;
        images[key] = url;
        writeImages(images);
        return sendJson(res, 200, { ok: true, key, url });
      }

      return sendJson(res, 400, { error: 'no_image' });
    });
  }

  // ---- uploaded files (from data volume) ----
  if (urlPath.startsWith('/uploads/')) {
    const name = path.basename(urlPath);
    const fp = path.join(UPLOAD_DIR, name);
    return fs.stat(fp, (e, st) => {
      if (e || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
      const ext = path.extname(fp).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'public, max-age=86400' });
      fs.createReadStream(fp).pipe(res);
    });
  }

  // ---- /admin -> admin.html ----
  let filePath = urlPath;
  if (filePath === '/' || filePath === '') filePath = '/index.html';
  if (filePath === '/admin' || filePath === '/admin/') filePath = '/admin.html';

  const safePath = path.normalize(path.join(ROOT, filePath));
  if (!safePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.stat(safePath, (err, st) => {
    if (err || !st.isFile()) {
      const fallback = path.join(ROOT, 'index.html');
      return fs.readFile(fallback, (e2, data) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(404, { 'Content-Type': MIME['.html'] });
        res.end(data);
      });
    }
    const ext = path.extname(safePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, () => console.log(`La Taverna site running on port ${PORT} (data: ${DATA_DIR})`));
