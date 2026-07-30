import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const SVG_PATH = join(process.cwd(), 'public', 'favicon-jersey.svg');
const OUTPUT_DIR = join(process.cwd(), 'public', 'favicons');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-64x64.png', size: 64 },
  { name: 'favicon-128x128.png', size: 128 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'favicon.png', size: 192 },
];

async function generateFavicons() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Generating favicons from SVG...');

  for (const { name, size } of sizes) {
    await sharp(SVG_PATH)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ 
        quality: 100,
        compressionLevel: 9,
      })
      .toFile(join(OUTPUT_DIR, name));
    
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // Also copy to public root for easy access
  for (const { name } of sizes) {
    const src = join(OUTPUT_DIR, name);
    const dest = join(process.cwd(), 'public', name);
    const { copyFileSync } = await import('fs');
    if (existsSync(src)) {
      copyFileSync(src, dest);
    }
  }

  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);
