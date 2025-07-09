require('dotenv').config();
const { ethers } = require('ethers');
const { uploadTodayGif } = require('../upload_to_pinata.js');

// Debug environment variables
console.log('=== Environment Debug ===');
console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
console.log('PRIVATE_KEY length:', process.env.PRIVATE_KEY?.length || 'undefined');
console.log('RPC_URL exists:', !!process.env.RPC_URL);
console.log('CONTRACT_ADDRESS exists:', !!process.env.CONTRACT_ADDRESS);

// Load env vars
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Validate private key before using it
if (!PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY is missing from environment variables');
    process.exit(1);
}

if (PRIVATE_KEY.length !== 64 && PRIVATE_KEY.length !== 66) {
    console.error('❌ PRIVATE_KEY has invalid length:', PRIVATE_KEY.length);
    console.error('Expected: 64 characters (without 0x) or 66 characters (with 0x)');
    process.exit(1);
}

console.log('✅ Private key format looks correct');
console.log('=== End Debug ===');

// Your contract ABI: adjust based on actual method name in DailyNFT
const ABI = [
  "function safeMint(address to, string memory uri) public"
];

async function main() {
  // Connect
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  // IPFS URL (replace daily if automated)
   const ipfsHash = await uploadTodayGif();   // ← uploads + returns new CID
  const tokenURI = `ipfs://${ipfsHash}`;
  // const ipfsHash = 'QmcWmhZzC44Wh9HRbngFtUu3UH7Z9EEGe482fcpm2jxgLr';
  // const tokenURI = `ipfs://${ipfsHash}`;

// const ipfsHash = fs.readFileSync('latest_cid.txt', 'utf8').trim();
// const tokenURI = `ipfs://${ipfsHash}`;

  // Call safeMint
  console.log('Minting NFT...');
  const tx = await contract.safeMint(wallet.address, tokenURI);
  console.log('Waiting for confirmation...');
  const receipt = await tx.wait();
  console.log('✅ Minted! Tx hash:', receipt.hash);
}

main().catch(console.error);
