const { exec } = require('child_process');

const root = __dirname;
const today = new Date().toISOString().slice(0, 10);
const execOpts = { cwd: root };

async function run() {
  try {
    console.log(`🎨 Generating today's GIF: ${today}.gif...`);

    // run generate_gif.js
    await new Promise((resolve, reject) => {
      exec('node generate_gif.js', execOpts, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Generation failed: ${error.message}`);
          return reject(error);
        }
        console.log(stdout);
        resolve();
      });
    });

    console.log('✅ GIF generation complete!');

    console.log('📦 Uploading to Pinata...');

    // run upload_to_pinata.js
    await new Promise((resolve, reject) => {
      exec('node upload_to_pinata.js', execOpts, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Upload failed: ${error.message}`);
          return reject(error);
        }
        console.log(stdout);
        resolve();
      });
    });

    console.log('🎉 All done!');
  } catch (err) {
    console.error('❌ Something went wrong:', err);
  }
}

run();
