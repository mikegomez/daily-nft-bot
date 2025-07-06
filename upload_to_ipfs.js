const fs = require('fs');
const path = require('path');
const mime = require('mime');
const { NFTStorage, File } = require('nft.storage');

// replace with your actual API key
const NFT_STORAGE_API_KEY = 'Insert api key here';

async function uploadToIPFS(filePath) {
  const storage = new NFTStorage({ token: NFT_STORAGE_API_KEY });

  const content = fs.readFileSync(filePath);
  console.log('Read file size:', content.length);
  const type = mime.getType(filePath);
  const file = new File([content], path.basename(filePath), { type });

 try {
  console.log('📦 Uploading to IPFS...');
  const metadata = await storage.store({
    name: path.basename(filePath),
    description: 'Daily generative art GIF',
    image: file
  });
  console.log('✅ Uploaded!');
  console.log('Metadata URL (IPFS):', metadata.url);
  console.log('Direct image CID:', metadata.data.image.href);
} catch (err) {
  console.error('❌ Upload failed:', err);
}

}
const today = new Date().toISOString().slice(0,10);
const filePath = path.join(__dirname, 'art', `${today}.gif`);

uploadToIPFS(filePath).catch(console.error);
