// require('dotenv').config();
// const hre = require("hardhat");

// async function main() {
//   const contractAddress = "0x4101B43d059B9EaDFfE96c31218710D427155A33";
//   const metadataURI = "ipfs://QmfBmHuhAwWaY59egv6Sbs5Qj6PCcAg878em4w1XY6KzNX";

//   const [deployer] = await hre.ethers.getSigners();

//   const contract = await hre.ethers.getContractAt("DailyNFT", contractAddress);

//   const tx = await contract.safeMint(deployer.address, metadataURI);
//   await tx.wait();

//   console.log(`✅ Minted new NFT with URI: ${metadataURI}`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const DailyNFT = await hre.ethers.getContractFactory("DailyNFT");
  const dailyNFT = await DailyNFT.deploy();

  // wait for deployment
  await dailyNFT.waitForDeployment();

  console.log("✅ Deployed DailyNFT to:", await dailyNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// require('dotenv').config();
// const hre = require("hardhat");

// async function main() {
//   const DailyNFT = await hre.ethers.getContractFactory("DailyNFT");
//   const dailyNFT = await DailyNFT.deploy(); // add constructor args if needed
//   await dailyNFT.deployed();

//   console.log("✅ DailyNFT deployed to:", dailyNFT.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
