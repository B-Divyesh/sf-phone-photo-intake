import { mkdir, copyFile, readFile, readdir, writeFile } from 'node:fs/promises';

for (const route of ['privacy', 'terms']) {
  await mkdir(new URL(`../dist/${route}/`, import.meta.url), { recursive: true });
  await copyFile(new URL('../dist/index.html', import.meta.url), new URL(`../dist/${route}/index.html`, import.meta.url));
}

const assetsDirectory = new URL('../dist/assets/', import.meta.url);
const assets = (await readdir(assetsDirectory))
  .filter((name) => /\.(?:js|css|webp|avif|png)$/.test(name))
  .map((name) => `/assets/${name}`);
const serviceWorkerUrl = new URL('../dist/sw.js', import.meta.url);
const serviceWorker = await readFile(serviceWorkerUrl, 'utf8');
await writeFile(serviceWorkerUrl, serviceWorker.replace('/*__PRECACHE__*/', assets.map((asset) => JSON.stringify(asset)).join(',')));
