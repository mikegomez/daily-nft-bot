// Generates one PNG preview per style (0-7) so you can see what each looks like.
// Run: node test_preview.js
// Output: art/preview-style-0.png through art/preview-style-7.png

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

  for (let style = 0; style < 9; style++) {
    const name = STYLE_NAMES[style];
    console.log(`🎨 Generating style ${style}: ${name}...`);

    const seed = Math.floor(Math.random() * 90000) + 10000;
    const url = `file://${path.join(__dirname, 'sketch.html')}?frame=15&seed=${seed}&style=${style}`;

    await page.goto(url);
    await page.waitForSelector('canvas');
    await new Promise(r => setTimeout(r, 600));

    const outPath = path.join(outputDir, `preview-style-${style}-${name}.png`);
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1000, height: 1000 } });
    console.log(`   ✅ Saved: ${outPath}`);
  }

  await browser.close();
  console.log('\n✨ All 8 style previews saved to art/');
})();
