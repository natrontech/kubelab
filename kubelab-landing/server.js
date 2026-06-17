import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const BUILD_DIR = process.env.BUILD_DIR || join(__dirname, 'build');

// Environment variables to inject
const ENV_VARS = {
  PUBLIC_FORMSPREE_ENDPOINT: process.env.PUBLIC_FORMSPREE_ENDPOINT || '',
  PUBLIC_PLAUSIBLE_ENABLED: process.env.PUBLIC_PLAUSIBLE_ENABLED || 'false',
  PUBLIC_PLAUSIBLE_DOMAIN: process.env.PUBLIC_PLAUSIBLE_DOMAIN || '',
};

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function getMimeType(path) {
  const ext = extname(path).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function injectEnvVars(html) {
  // Create script tag with environment variables
  // Inject before closing </head> tag so it's available early
  const envScript = `<script>window.__ENV__ = ${JSON.stringify(ENV_VARS)};</script>`;

  return html.replace('</head>', `${envScript}</head>`);
}

function serveIndexHtml(res) {
  const indexPath = join(BUILD_DIR, 'index.html');
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf8');
    const injectedHtml = injectEnvVars(html);
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    });
    res.end(injectedHtml);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

function serveFile(req, res, filePath) {
  try {
    if (!existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const stats = statSync(filePath);
    if (!stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const content = readFileSync(filePath);
    const mimeType = getMimeType(filePath);

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': mimeType.startsWith('image/') || mimeType.includes('font')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate'
    });
    res.end(content);
  } catch (error) {
    console.error('Error serving file:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

const server = createServer((req, res) => {
  let pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  // Remove leading slash
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = join(BUILD_DIR, pathname);

  // Check if file exists and is actually a file (not a directory)
  if (existsSync(filePath) && !pathname.endsWith('/')) {
    try {
      const stats = statSync(filePath);
      if (!stats.isFile()) {
        serveIndexHtml(res);
        return;
      }
    } catch (error) {
      serveIndexHtml(res);
      return;
    }

    const content = readFileSync(filePath);

    // Inject env vars into HTML files
    if (pathname.endsWith('.html')) {
      const html = injectEnvVars(content.toString());
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=0, must-revalidate'
      });
      res.end(html);
    } else {
      serveFile(req, res, filePath);
    }
  } else {
    serveIndexHtml(res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables:', ENV_VARS);
});

