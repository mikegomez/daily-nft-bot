// const puppeteer = require('puppeteer');
// const GIFEncoder = require('gifencoder');
// const fs = require('fs');
// const { createCanvas, loadImage } = require('canvas');

// (async () => {
//   const width = 1000;
//   const height = 1000;
//   const totalFrames = 30;      // adjust number of frames
//   const delay = 150;           // ms per frame (100ms = 10fps)

//   // Setup GIF encoder
//   const encoder = new GIFEncoder(width, height);
//   if (!fs.existsSync('art')) fs.mkdirSync('art');
//   const today = new Date().toISOString().slice(0,10);
//   encoder.createReadStream().pipe(fs.createWriteStream(`art/${today}.gif`));
//   encoder.start();
//   encoder.setRepeat(0); // 0 = loop forever
//   encoder.setDelay(delay);
//   encoder.setQuality(10);

//   const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
//   const page = await browser.newPage();

//   for (let frame = 0; frame < totalFrames; frame++) {
//     console.log(`Generating frame ${frame+1}/${totalFrames}`);
//     await page.goto(`file://${__dirname}/sketch.html?frame=${frame}`);
//     await new Promise(resolve => setTimeout(resolve, 500)); // wait for drawing

//     const buffer = await page.screenshot({ clip: { x:0, y:0, width, height } });
//     const img = await loadImage(buffer);

//     const canvas = createCanvas(width, height);
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0, width, height);

//     encoder.addFrame(ctx);
//   }

//   encoder.finish();
//   await browser.close();

//   console.log(`✅ GIF generated: art/${today}.gif`);
// })();

const puppeteer = require('puppeteer');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

function randomPalette(dateSeed) {
  const hue = (dateSeed % 360) || Math.floor(Math.random() * 360);
  return {
    bg: `hsl(${hue}, ${Math.floor(Math.random() * 40) + 45}%, ${Math.floor(Math.random() * 20) + 15}%)`,
    fill: `hsl(${(hue + 90 + Math.floor(Math.random() * 120)) % 360}, ${Math.floor(Math.random() * 40) + 55}%, ${Math.floor(Math.random() * 35) + 45}%)`,
    accent: `hsl(${(hue + 180 + Math.floor(Math.random() * 120)) % 360}, ${Math.floor(Math.random() * 40) + 55}%, ${Math.floor(Math.random() * 35) + 40}%)`
  };
}

(async () => {
  const width = 1000;
  const height = 1000;
  const totalFrames = 30;
  const delay = 90;

  const today = new Date().toISOString().slice(0,10);
  const dateSeed = today.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const palette = randomPalette(dateSeed);
  const outputDir = path.join(__dirname, 'art');
  const filename = `${today}.gif`;

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream().pipe(fs.createWriteStream(path.join(outputDir, filename)));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(delay);
  encoder.setQuality(10);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width, height });

  for (let frameNumber = 0; frameNumber < totalFrames; frameNumber++) {
    console.log(`🖼 Generating frame ${frameNumber+1}/${totalFrames}`);

    const speed = (Math.random() * 0.7 + 0.3).toFixed(2);
    const shapeCount = Math.floor(Math.random() * 12) + 8;
    const shapeType = ['circle', 'rect', 'triangle', 'line', 'arc'][Math.floor(Math.random() * 5)];
    const shapeSeed = dateSeed + frameNumber * 17 + Math.floor(Math.random() * 1000);
    const query = new URLSearchParams({
      frame: frameNumber,
      seed: shapeSeed,
      shapes: shapeCount,
      speed,
      type: shapeType,
      palette: JSON.stringify(palette)
    });

    await page.goto(`file://${path.join(__dirname, 'sketch.html')}?${query.toString()}`);
    await page.waitForSelector('canvas');
    await new Promise((resolve) => setTimeout(resolve, 350));

    const screenshotPath = path.join(outputDir, `frame-${frameNumber}.png`);
    await page.screenshot({ path: screenshotPath, type: 'png', clip: { x: 0, y: 0, width, height } });
    const img = await loadImage(screenshotPath);

    ctx.drawImage(img, 0, 0, width, height);
    encoder.addFrame(ctx);
    fs.unlinkSync(screenshotPath);
  }

  encoder.finish();
  await browser.close();

  console.log(`✅ GIF generated: art/${filename}`);
})();
