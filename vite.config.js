import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback middleware to ensure /api/movies never returns HTML (index.html)
// if MSW Service Worker is bypassed by hard refresh (Ctrl+F5) or not yet claimed
function apiMockFallbackPlugin() {
  return {
    name: 'api-mock-fallback-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/movies')) {
          const parsedUrl = new URL(req.url, 'http://localhost');
          const pathname = parsedUrl.pathname;

          // Artificial delay 50ms to match MSW latency benchmark
          await new Promise((resolve) => setTimeout(resolve, 50));

          // Detail endpoint: /api/movies/:id
          const detailMatch = pathname.match(/^\/api\/movies\/(\d+)$/);
          if (detailMatch) {
            const id = detailMatch[1];
            try {
              const filePath = path.resolve(__dirname, 'src/mocks/data/movies_600.json');
              const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              const movie = data.find((m) => String(m.id) === String(id));

              res.setHeader('Content-Type', 'application/json');
              if (movie) {
                res.statusCode = 200;
                res.end(JSON.stringify(movie));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: `Movie with ID ${id} not found.` }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          // Catalog endpoint: /api/movies?limit=...
          if (pathname === '/api/movies') {
            const limit = parsedUrl.searchParams.get('limit') || '200';
            const validLimit = ['200', '400', '600'].includes(limit) ? limit : '200';
            try {
              const filePath = path.resolve(__dirname, `src/mocks/data/movies_${validLimit}.json`);
              const content = fs.readFileSync(filePath, 'utf-8');

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(content);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiMockFallbackPlugin(),
  ],
});
