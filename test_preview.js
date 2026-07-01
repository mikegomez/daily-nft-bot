// Generates one PNG preview per style (0-8) so you can see what each looks like.
// Run: node test_preview.js
// Output: art/preview-style-0.png through art/preview-style-8.png

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createImageSeed } = require('./lib/image_seed');

const STYLE_NAMES = [
  'flow-field',
  'mandala',
  'fractal-tree',
  'lissajous',
  'landscape',
  'particle-spiral',
  'neon-waves',
  'abstract-blobs',
  'wireframe-art'
];

(async () => {
  const outputDir = path.join(__dirname, 'art');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const today = new Date().toISOString().slice(0, 10);

  for (let style = 0; style < 9; style++) {
    const name = STYLE_NAMES[style];
    console.log(`🎨 Generating style ${style}: ${name}...`);

    const seed = createImageSeed({ date: today, frameNumber: 15, style, salt: `preview-${name}`, randomize: true });
    const url = `file://${path.join(__dirname, 'sketch.html')}?frame=15&seed=${seed}&style=${style}`;

    await page.goto(url);
    await page.waitForSelector('canvas');
    await new Promise(r => setTimeout(r, 600));

    const outPath = path.join(outputDir, `preview-style-${style}-${name}.png`);
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1000, height: 1000 } });
    console.log(`   ✅ Saved: ${outPath}`);
  }

  await browser.close();
  console.log('\n✨ All 9 style previews saved to art/');
})();
