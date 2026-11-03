import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = ['public', 'public/screenshots'];

async function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) continue;

    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const webpPath = path.join(dir, `${baseName}.webp`);

      const beforeSize = stat.size;
      try {
        await sharp(fullPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(webpPath);
        
        const afterSize = fs.statSync(webpPath).size;
        const savedPercent = ((1 - afterSize / beforeSize) * 100).toFixed(1);
        console.log(`[Converted] ${file} -> ${baseName}.webp: ${(beforeSize/1024).toFixed(1)} KB -> ${(afterSize/1024).toFixed(1)} KB (-${savedPercent}%)`);
      } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log('Starting image optimization to WebP...');
  for (const d of dirs) {
    if (fs.existsSync(d)) {
      await processDir(d);
    }
  }
  console.log('Finished converting images to WebP.');
}

main();
