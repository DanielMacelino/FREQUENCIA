const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full, cb);
    else cb(full);
  });
}

const targets = [
  path.join(__dirname, '..', 'fatura', 'client', 'build'),
  path.join(__dirname, '..', 'frontend', 'dist'),
  path.join(__dirname, '..', 'fatura', 'client', 'build', 'static', 'js'),
  path.join(__dirname, '..', 'frontend', 'dist', 'assets')
];

let removed = 0;
for (const t of targets) {
  if (!fs.existsSync(t)) continue;
  walk(t, (file) => {
    if (/\.map$/.test(file) || /\.LICENSE\.txt$/.test(file)) {
      try {
        fs.unlinkSync(file);
        removed++;
        console.log('removed', file);
      } catch (e) {
        console.warn('failed to remove', file, e.message);
      }
    }
  });
}
console.log('clean-build complete, files removed:', removed);
