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

(async () => {
  const width = 1000;
  const height = 1000;
  const totalFrames = 30;    // smoother
  const delay = 150;         // 150 ms per frame

  const today = new Date().toISOString().slice(0,10);
  const outputDir = path.join(__dirname, 'art');
  const filename = `${today}.gif`;

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Setup GIF encoder
  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream().pipe(fs.createWriteStream(path.join(outputDir, filename)));
  encoder.start();
  encoder.setRepeat(0);      // loop forever
  encoder.setDelay(delay);
  encoder.setQuality(10);

  // Create canvas & ctx for each frame
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width, height });

  for (let frameNumber = 0; frameNumber < totalFrames; frameNumber++) {
    console.log(`🖼 Generating frame ${frameNumber+1}/${totalFrames}`);

    // Pass frameNumber into sketch
    await page.goto(`file://${__dirname}/sketch.html?frame=${frameNumber}`);
   // await page.waitForTimeout(100); // give p5.js time to draw
await new Promise(resolve => setTimeout(resolve, 100));

    const buffer = await page.screenshot({ clip: { x:0, y:0, width, height } });
    const img = await loadImage(buffer);

    ctx.drawImage(img, 0, 0, width, height);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  await browser.close();

  console.log(`✅ GIF generated: art/${filename}`);
})();
