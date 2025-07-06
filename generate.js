const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  // Load your local file
  await page.goto(`file://${__dirname}/sketch.html`);

  // Wait a bit for p5.js to finish drawing
await new Promise(resolve => setTimeout(resolve, 2000));

  // Create folder if it doesn't exist
  const today = new Date().toISOString().slice(0,10);
  if (!fs.existsSync('art')) fs.mkdirSync('art');

  // Save screenshot
  await page.screenshot({ path: `art/${today}.png` });

  await browser.close();
  console.log(`✅ Art generated: art/${today}.png`);
})();
