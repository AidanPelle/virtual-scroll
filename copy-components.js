const fs = require('fs');
const path = require('path');

const srcDir = 'src/examples/components';
const targetDir = 'src/assets/components';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath); // Recursively copy subdirectories
    } else {
      fs.copyFileSync(srcPath, destPath); // Copy files
      console.log(`Copied ${srcPath} -> ${destPath}`);
    }
  }
}

copyDirectoryRecursive(srcDir, targetDir);