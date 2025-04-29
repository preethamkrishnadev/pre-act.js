#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appName = process.argv[2];

if (!appName) {
  console.log('❌ Usage: create-pre-act <project-name>');
  process.exit(1);
}

const root = path.resolve(process.cwd(), appName);
fs.mkdirSync(root, { recursive: true });

fs.writeFileSync(
  path.join(root, 'package.json'),
  JSON.stringify({
    name: appName,
    version: '0.0.1',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      "@preethamkrishna/pre-act.js": "^0.1.2"
    },
    devDependencies: {
      "vite": "^5.0.0"
    }
  }, null, 2)
);

// Write basic files...
fs.mkdirSync(path.join(root, 'src/pages'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/app.jsx'), `
import { createApp, Router, loadPages } from '@preethamkrishna/pre-act.js';
const routes = loadPages();

function App() {
  return Router({ routes });
}

const app = createApp(App, '#app');
app.debug = true;
app.mount();
`.trim());

fs.writeFileSync(path.join(root, 'src/pages/index.page.jsx'), `
export default function Home(props, node) {
  return <div className="p-6 text-2xl">Hello from Pre-Act.js 👋</div>;
}
`.trim());

fs.writeFileSync(path.join(root, 'index.html'), `
<!DOCTYPE html>
<html><body><div id="app"></div><script type="module" src="/src/app.jsx"></script></body></html>
`.trim());

console.log(`📁 Created ${appName}`);
console.log('📦 Installing...');
execSync('npm install', { cwd: root, stdio: 'inherit' });

console.log('✅ Done!');
console.log(`👉 cd ${appName}`);
console.log('👉 npm run dev');
