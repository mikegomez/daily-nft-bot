if (process.env.GITHUB_ACTIONS !== 'true') {
  require('dotenv').config();
}
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
//require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// async function uploadToPinata() {
//   try {
//     const today = new Date().toISOString().slice(0, 10);  // e.g. "2025-07-06"
//     const filePath = `./art/${today}.gif`;

//     if (!fs.existsSync(filePath)) {
//       console.error(`❌ File not found: ${filePath}`);
//       return;
//     }

//     const fileStream = fs.createReadStream(filePath);

//     const formData = new FormData();
//     formData.append('file', fileStream);

//     console.log(`📦 Uploading ${filePath} to Pinata...`);

//     const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
//       maxContentLength: Infinity,
//       headers: {
//         ...formData.getHeaders(),
//         pinata_api_key: PINATA_API_KEY,
//         pinata_secret_api_key: PINATA_SECRET_API_KEY
//       }
//     });

//     console.log('✅ Success! IPFS hash:', res.data.IpfsHash);
//     console.log(`🌐 https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
//   } catch (err) {
//     console.error('❌ Upload failed:', err.response ? err.response.data : err.message);
//   }
// }

// uploadToPinata();
async function uploadTodayGif() {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('PINATA_API_KEY and PINATA_SECRET_API_KEY must be set in the environment');
    }

    const today = new Date().toISOString().slice(0, 10);  // e.g. "2025-07-06"
    const filePath = path.join(__dirname, 'art', `${today}.gif`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ File not found: ${filePath}`);
    }

    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append('file', fileStream);

    console.log(`📦 Uploading ${filePath} to Pinata...`);

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxContentLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY
      }
    });

    console.log('✅ Uploaded! IPFS hash:', res.data.IpfsHash);
    return res.data.IpfsHash;

  } catch (err) {
    console.error('❌ Upload failed:', err.response ? err.response.data : err.message);
    throw err;  // important so caller knows it failed
  }
}

module.exports = { uploadTodayGif };

if (require.main === module) {
  uploadTodayGif()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}