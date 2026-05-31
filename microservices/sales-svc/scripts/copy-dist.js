const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'dist', 'microservices', 'sales-svc', 'src');
const targetDir = path.join(__dirname, '..', 'dist');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy files from source to target
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory does not exist: ${src}`);
    process.exit(1);
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const items = fs.readdirSync(src);
    items.forEach(item => {
      copyRecursive(path.join(src, item), path.join(dest, item));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(sourceDir, targetDir);
console.log('Copied dist files to correct location');
