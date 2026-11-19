import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Схему города берём из того же berlin.pmtiles, что и 2D-приложение (../berlinmetro/public/tiles),
// без копии. pmtiles читает файл кусками, поэтому отдаём с поддержкой HTTP Range.
const SHARED = path.resolve(__dirname, '../berlinmetro/public');

function sharedTiles() {
  const serve = (req, res, next) => {
    const url = decodeURIComponent((req.url || '').split('?')[0]);
    if (!url.startsWith('/tiles/')) return next();
    const file = path.join(SHARED, url);
    if (!file.startsWith(SHARED) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.statusCode = 404; return res.end(); }
    const size = fs.statSync(file).size;
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', 'application/octet-stream');
    const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (m) {
      const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
      const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
      res.setHeader('Content-Length', end - start + 1);
      if (req.method === 'HEAD') return res.end();
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.setHeader('Content-Length', size);
    if (req.method === 'HEAD') return res.end();
    return fs.createReadStream(file).pipe(res);
  };
  return { name: 'shared-tiles', configureServer: (s) => { s.middlewares.use(serve); }, configurePreviewServer: (s) => { s.middlewares.use(serve); } };
}

export default defineConfig({
  plugins: [react(), sharedTiles()],
  base: '/',
  server: { port: 5174, strictPort: false },
});
