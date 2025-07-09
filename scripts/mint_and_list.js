require('dotenv').config();
const { ethers } = require('ethers');
const { uploadTodayGif } = require('../upload_to_pinata.js');

// Load env vars
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

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
