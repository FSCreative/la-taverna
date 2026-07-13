// La Taverna VIII – static server + admin image API + GDPR self-hosted assets
// No third-party requests happen in the visitor's browser: fonts and default
// images are fetched ONCE by this server and cached on the persistent volume.
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const ASSET_DIR = path.join(DATA_DIR, 'assets');
const FONT_DIR = path.join(ASSET_DIR, 'fonts');
const IMG_DIR = path.join(ASSET_DIR, 'img');
const IMAGES_FILE = path.join(DATA_DIR, 'images.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'taverna2026';
const MAX_BODY = 9 * 1024 * 1024;

const KEYS = new Set(['logo','hero_bg','about','order_bg','gallery_1','gallery_2','gallery_3','gallery_4','gallery_5','gallery_6']);

// ---- self-hosted asset sources (fetched server-side only) ----
const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap';

const DEFAULT_IMAGES = {
  'logo.png':     'https://static.wixstatic.com/media/d2f3ea_6b0caa773b0c41aaaba561b49b440cbd~mv2.png',
  'hero.jpg':     'https://static.wixstatic.com/media/11062b_b6f3a9bdc88b4195b4af6792d79e28ac~mv2.jpg',
  'about.jpg':    'https://static.wixstatic.com/media/d2f3ea_c740e60d71c34f1682d9daab191f7d4d~mv2.jpg',
  'order.jpg':    'https://static.wixstatic.com/media/d2f3ea_2e8a8df6e3b043ad88f0f64753c4c8c8~mv2.jpg',
  'gallery1.jpg': 'https://static.wixstatic.com/media/11062b_b6f3a9bdc88b4195b4af6792d79e28ac~mv2.jpg',
  'gallery2.jpg': 'https://static.wixstatic.com/media/d2f3ea_2e8a8df6e3b043ad88f0f64753c4c8c8~mv2.jpg',
  'gallery3.jpg': 'https://static.wixstatic.com/media/d2f3ea_1af381b5dddc401c8bdabde58ece41b0~mv2.jpg',
  'gallery4.jpg': 'https://static.wixstatic.com/media/d2f3ea_414d9ff2628240c19ae38f9936d93f8f~mv2.jpg',
  'gallery5.jpg': 'https://static.wixstatic.com/media/d2f3ea_c740e60d71c34f1682d9daab191f7d4d~mv2.jpg',
  'gallery6.jpg': 'https://static.wixstatic.com/media/c837a6_27c8ec69a33c494e9eccc0f2cd7046dd~mv2.jpg'
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

for (const d of [UPLOAD_DIR, FONT_DIR, IMG_DIR]) {
  try { fs.mkdirSync(d, { recursive: true }); } catch (e) {}
}

function readImages() {
  try { return JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8')); } catch (e) { return {}; }
}
function writeImages(obj) {
  try { fs.writeFileSync(IMAGES_FILE, JSON.stringify(obj, null, 2)); return true; }
  catch (e) { console.error('writeImages failed:', e.message); return false; }
}

// fetch a remote URL server-side (follows redirects) -> Buffer
function fetchRemote(url, cb, depth) {
  depth = depth || 0;
  if (depth > 5) return cb(new Error('too_many_redirects'));
  https.get(url, { headers: { 'User-Agent': UA, 'Accept': '*/*' } }, res => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      res.resume();
      const next = new URL(res.headers.location, url).toString();
      return fetchRemote(next, cb, depth + 1);
    }
    if (res.statusCode !== 200) { res.resume(); return cb(new Error('http_' + res.statusCode)); }
    const chunks = [];
    res.on('data', d => chunks.push(d));
    res.on('end', () => cb(null, Buffer.concat(chunks)));
  }).on('error', cb);
}

// ---- fonts: download Google CSS + woff2 files once, rewrite to local paths ----
const FONTS_CSS_FILE = path.join(FONT_DIR, 'fonts.css');
let fontsBuilding = false;

function buildFontsCss(cb) {
  if (fs.existsSync(FONTS_CSS_FILE)) return cb(null, fs.readFileSync(FONTS_CSS_FILE));
  if (fontsBuilding) return cb(new Error('busy'));
  fontsBuilding = true;
  fetchRemote(GOOGLE_FONTS_CSS_URL, (err, buf) => {
    if (err) { fontsBuilding = false; return cb(err); }
    let css = buf.toString('utf8');
    const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^\)'"]+/g) || [])];
    let pending = urls.length;
    if (!pending) { fontsBuilding = false; return cb(new Error('no_fonts_found')); }
    urls.forEach(u => {
      const name = path.basename(u.split('?')[0]);
      const dest = path.join(FONT_DIR, name);
      const done = () => {
        css = css.split(u).join('/assets/fonts/' + name);
        if (--pending === 0) {
          try { fs.writeFileSync(FONTS_CSS_FILE, css); } catch (e) {}
          fontsBuilding = false;
          cb(null, Buffer.from(css));
        }
      };
      if (fs.existsSync(dest)) return done();
      fetchRemote(u, (e2, fbuf) => {
        if (!e2) { try { fs.writeFileSync(dest, fbuf); } catch (e) {} }
        done();
      });
    });
  });
}

// ---- default images: download once, cache on the volume ----
function ensureImage(name, cb) {
  const dest = path.join(IMG_DIR, name);
  if (fs.existsSync(dest)) return cb(null, dest);
  const src = DEFAULT_IMAGES[name];
  if (!src) return cb(new Error('unknown'));
  fetchRemote(src, (err, buf) => {
    if (err) return cb(err);
    try { fs.writeFileSync(dest, buf); } catch (e) { return cb(e); }
    cb(null, dest);
  });
}

// warm the cache on boot so visitors never wait
function warmCache() {
  buildFontsCss(e => console.log('fonts cache:', e ? 'ERR ' + e.message : 'ok'));
  Object.keys(DEFAULT_IMAGES).forEach(n =>
    ensureImage(n, e => { if (e) console.log('img ' + n + ': ERR ' + e.message); })
  );
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
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
function sendFile(res, fp, cacheSeconds) {
  const ext = path.extname(fp).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'public, max-age=' + (cacheSeconds || 86400)
  });
  fs.createReadStream(fp).pipe(res);
}

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

  // ---- self-hosted fonts ----
  if (urlPath === '/assets/fonts.css') {
    return buildFontsCss((err, css) => {
      if (err) { res.writeHead(503); return res.end('/* fonts unavailable */'); }
      res.writeHead(200, { 'Content-Type': MIME['.css'], 'Cache-Control': 'public, max-age=604800' });
      res.end(css);
    });
  }
  if (urlPath.startsWith('/assets/fonts/')) {
    const fp = path.join(FONT_DIR, path.basename(urlPath));
    if (!fs.existsSync(fp)) { res.writeHead(404); return res.end('Not found'); }
    return sendFile(res, fp, 31536000);
  }

  // ---- self-hosted default images ----
  if (urlPath.startsWith('/assets/img/')) {
    const name = path.basename(urlPath);
    return ensureImage(name, (err, fp) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      sendFile(res, fp, 604800);
    });
  }

  // ---- favicon (own domain, no redirect to third parties) ----
  if (urlPath === '/favicon.ico') {
    return ensureImage('logo.png', (err, fp) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      fs.createReadStream(fp).pipe(res);
    });
  }

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

      if (req.method === 'DELETE' || body.reset) {
        delete images[key];
        if (!writeImages(images)) return sendJson(res, 500, { error: 'write_failed' });
        return sendJson(res, 200, { ok: true, key, url: null });
      }

      if (body.hide) {
        images[key] = '__hidden__';
        if (!writeImages(images)) return sendJson(res, 500, { error: 'write_failed' });
        return sendJson(res, 200, { ok: true, key, url: '__hidden__' });
      }

      if (body.url && /^https?:\/\//i.test(body.url)) {
        images[key] = body.url;
        if (!writeImages(images)) return sendJson(res, 500, { error: 'write_failed' });
        return sendJson(res, 200, { ok: true, key, url: body.url });
      }

      if (body.dataUrl && /^data:/i.test(body.dataUrl)) {
        const m = body.dataUrl.match(/^data:([^;]+);base64,(.*)$/);
        if (!m) return sendJson(res, 400, { error: 'bad_data' });
        const ext = EXT_FOR_MIME[m[1].toLowerCase()];
        if (!ext) return sendJson(res, 400, { error: 'unsupported_type' });
        const fname = key + '_' + Date.now() + ext;
        try { fs.writeFileSync(path.join(UPLOAD_DIR, fname), Buffer.from(m[2], 'base64')); }
        catch (e) { return sendJson(res, 500, { error: 'write_failed' }); }
        const url = '/uploads/' + fname;
        images[key] = url;
        if (!writeImages(images)) return sendJson(res, 500, { error: 'write_failed' });
        return sendJson(res, 200, { ok: true, key, url });
      }

      return sendJson(res, 400, { error: 'no_image' });
    });
  }

  // ---- admin-uploaded files ----
  if (urlPath.startsWith('/uploads/')) {
    const fp = path.join(UPLOAD_DIR, path.basename(urlPath));
    return fs.stat(fp, (e, st) => {
      if (e || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
      sendFile(res, fp, 86400);
    });
  }

  // ---- pages / static files ----
  let filePath = urlPath;
  if (filePath === '/' || filePath === '') filePath = '/index.html';
  if (filePath === '/admin' || filePath === '/admin/') filePath = '/admin.html';
  if (filePath === '/impressum') filePath = '/impressum.html';
  if (filePath === '/datenschutz') filePath = '/datenschutz.html';

  const safePath = path.normalize(path.join(ROOT, filePath));
  if (!safePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.stat(safePath, (err, st) => {
    if (err || !st.isFile()) {
      return fs.readFile(path.join(ROOT, 'index.html'), (e2, data) => {
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

server.listen(PORT, () => {
  console.log(`La Taverna running on port ${PORT} (data: ${DATA_DIR})`);
  warmCache();
});
