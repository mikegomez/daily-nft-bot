const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Replace with your real keys:
const PINATA_API_KEY = 'e904e9864a4a515102e5';  // before the dot
const PINATA_SECRET_API_KEY = 'bf4210fc9119c50f522c9bfa84d44bf5db84506a215568a4fadb8f5a52f9acd4';  // after the dot

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
