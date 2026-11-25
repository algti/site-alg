// Pré-renderiza as rotas em HTML estático (SEO e carregamento mais rápido).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const root = process.cwd();
const buildDir = path.join(root, 'build');
const ssrDir = path.join(root, '.ssr-build');

const env = loadEnv('production', root, 'VITE_');
const siteUrl = (env.VITE_SITE_URL || 'https://algti.com.br').replace(/\/$/, '');

const template = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf-8');
const { render, routes, buildHeadHtml } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const headBlock = /<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/;

const build = (url) =>
  template
    .replace(headBlock, () => buildHeadHtml(url))
    .replace('<div id="root"><!--app-html--></div>', () => `<div id="root" data-route="${url}">${render(url)}</div>`);

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

for (const route of routes) {
  const file = route === '/' ? 'index.html' : path.join(route.slice(1), 'index.html');
  write(path.join(buildDir, file), build(route));
  console.log(`prerender ${route} -> ${file}`);
}

write(path.join(buildDir, '404.html'), build('/__nao-encontrado'));

const urls = routes
  .map((r) => `  <url><loc>${siteUrl}${r === '/' ? '/' : r}</loc></url>`)
  .join('\n');
write(
  path.join(buildDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`sitemap.xml gerado com ${routes.length} URLs`);
