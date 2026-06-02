const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DailyNFTModule", (m) => {
  const dailyNFT = m.contract("DailyNFT");
  return { dailyNFT };
});
