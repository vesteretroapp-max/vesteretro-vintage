import sharp from 'sharp';
import { join } from 'path';

const SVG_PATH = join(process.cwd(), 'public', 'favicon-jersey.svg');
const ICO_PATH = join(process.cwd(), 'public', 'favicon.ico');

async function generateIco() {
  // Generate 32x32 PNG then convert to ICO format
  // sharp doesn't directly support ICO, so we'll create a 32x32 PNG as favicon.ico
  // Most modern browsers accept PNG as favicon.ico replacement
  await sharp(SVG_PATH)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ quality: 100 })
    .toFile(ICO_PATH.replace('.ico', '-temp.png'));
  
  // Copy as .ico (browsers accept PNG inside .ico extension for modern usage)
  const { copyFileSync } = await import('fs');
  copyFileSync(ICO_PATH.replace('.ico', '-temp.png'), ICO_PATH);
  
  // Cleanup temp
  const { unlinkSync } = await import('fs');
  unlinkSync(ICO_PATH.replace('.ico', '-temp.png'));
  
  console.log('  ✓ favicon.ico (32x32)');
}

generateIco().catch(console.error);
