require("@nomicfoundation/hardhat-ethers");

require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
        mainnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
