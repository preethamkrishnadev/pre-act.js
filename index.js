#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const appName = process.argv[2];
if (!appName) {
  console.error('❌ Please specify a project name:');
  console.error('   npx create-pre-act my-app');
  process.exit(1);
}

const root = path.resolve(process.cwd(), appName);
if (fs.existsSync(root)) {
  console.error('❌ Directory already exists. Choose another name.');
  process.exit(1);
}

fs.mkdirSync(root, { recursive: true });
console.log(`📁 Creating project in ${root}...`);

// Write package.json
fs.writeFileSync(
  path.join(root, 'package.json'),
  JSON.stringify({
    name: appName,
    version: '0.0.1',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      "pre-act": "latest"
    },
    devDependencies: {
      vite: "^5.0.0"
    }
  }, null, 2)
);

// Create Vite config
fs.writeFileSync(
  path.join(root, 'vite.config.js'),
  `
import { defineConfig } from 'vite';
export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  }
});
`.trim()
);

// Create index.html
fs.writeFileSync(
  path.join(root, 'src/index.html'),
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pre-Act App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/app.jsx"></script>
</body>
</html>
`.trim()
);

// Create App and Pages
const srcDir = path.join(root, 'src');
const pagesDir = path.join(srcDir, 'pages');
fs.mkdirSync(pagesDir, { recursive: true });

fs.writeFileSync(
  path.join(srcDir, 'app.jsx'),
  `
import { createApp, Router, loadPages } from 'pre-act';

const routes = loadPages();

function App() {
  return Router({ routes });
}

const app = createApp(App, '#app');
app.debug = true;
app.mount();
`.trim()
);

fs.writeFileSync(
  path.join(pagesDir, 'index.page.jsx'),
  `
export default function HomePage(props, node) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-500">Welcome to Pre-Act.js</h1>
      <p>Route: {node.path}</p>
    </div>
  );
}
`.trim()
);

// Final
console.log('📦 Installing dependencies...');
execSync('npm install', { cwd: root, stdio: 'inherit' });

console.log('✅ Project created successfully!');
console.log(`👉 cd ${appName}`);
console.log('👉 npm run dev');
