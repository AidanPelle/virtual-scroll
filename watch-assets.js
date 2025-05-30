// watch-assets.js
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const srcDir = 'src/demo/components';
const targetDir = 'src/assets/components';

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(srcPath, destPath) {
  ensureDirExists(path.dirname(destPath));
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${srcPath} -> ${destPath}`);
}

function removeFile(destPath) {
  if (fs.existsSync(destPath)) {
    fs.unlinkSync(destPath);
    console.log(`Removed ${destPath}`);
  }
}

// Start watching
const watcher = chokidar.watch(srcDir, { ignoreInitial: true });

watcher
  .on('add', srcPath => {
    const rel = path.relative(srcDir, srcPath);
    const dest = path.join(targetDir, rel);
    copyFile(srcPath, dest);
  })
  .on('change', srcPath => {
    const rel = path.relative(srcDir, srcPath);
    const dest = path.join(targetDir, rel);
    copyFile(srcPath, dest);
  })
  .on('unlink', srcPath => {
    const rel = path.relative(srcDir, srcPath);
    const dest = path.join(targetDir, rel);
    removeFile(dest);
  });

console.log(`Watching ${srcDir} for changes...`);