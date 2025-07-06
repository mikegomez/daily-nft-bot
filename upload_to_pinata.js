const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Replace with your real keys:
// const PINATA_API_KEY = '';  // before the dot
// const PINATA_SECRET_API_KEY = '';  // after the dot

async function uploadToPinata() {
  try {
//     const filePath = './art/2025-07-06.gif';   // change this to your actual gif file
//     const fileStream = fs.createReadStream(filePath);

//     const formData = new FormData();
//     formData.append('file', fileStream);

//     console.log('📦 Uploading to Pinata...');

//     const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
//       maxContentLength: Infinity,
//       headers: {
//         ...formData.getHeaders(),
//         pinata_api_key: PINATA_API_KEY,
//         pinata_secret_api_key: PINATA_SECRET_API_KEY
//       }
//     });

//     console.log('✅ Success! IPFS hash:', res.data.IpfsHash);
//     console.log(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
//   } catch (err) {
//     console.error('❌ Upload failed:', err.response ? err.response.data : err.message);
//   }
// }

//uploadToPinata();

    const today = new Date().toISOString().slice(0, 10);  // e.g. "2025-07-06"
    const filePath = `./art/${today}.gif`;

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
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

    console.log('✅ Success! IPFS hash:', res.data.IpfsHash);
    console.log(`🌐 https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
  } catch (err) {
    console.error('❌ Upload failed:', err.response ? err.response.data : err.message);
  }
}

uploadToPinata();
