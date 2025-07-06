const { NFTStorage, File } = require('nft.storage');

const NFT_STORAGE_API_KEY = 'Insert api key here';

async function test() {
  const storage = new NFTStorage({ token: NFT_STORAGE_API_KEY });

  try {
    console.log('✅ Trying to store a simple text file...');
    const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' });
    const cid = await storage.storeBlob(file);
    console.log('✅ Success! CID:', cid);
    console.log(`https://ipfs.io/ipfs/${cid}`);
  } catch (err) {
    console.error('❌ Failed:', err);
  }
}

test();
