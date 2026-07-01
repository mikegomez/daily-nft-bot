const puppeteer = require('puppeteer');
const fs = require('fs');
const { createImageSeed } = require('./lib/image_seed');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  const today = new Date().toISOString().slice(0,10);
  const seed = createImageSeed({ date: today, frameNumber: 0, style: 0, salt: 'daily-single', randomize: true });

  // Load your local file
  await page.goto(`file://${__dirname}/sketch.html?frame=0&seed=${seed}`);

  // Wait a bit for p5.js to finish drawing
await new Promise(resolve => setTimeout(resolve, 2000));

  // Create folder if it doesn't exist
  if (!fs.existsSync('art')) fs.mkdirSync('art');

  // Save screenshot
  await page.screenshot({ path: `art/${today}.png` });

  await browser.close();
  console.log(`✅ Art generated: art/${today}.png`);
})();
