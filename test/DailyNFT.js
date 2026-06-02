const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("DailyNFT", function () {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    const DailyNFT = await ethers.getContractFactory("DailyNFT");
    const dailyNFT = await DailyNFT.deploy();
    await dailyNFT.waitForDeployment();
    return { dailyNFT, owner, other };
  }

  describe("Deployment", function () {
    it("sets ERC721 metadata and initial counter", async function () {
      const { dailyNFT, owner } = await loadFixture(deployFixture);

      expect(await dailyNFT.name()).to.equal("DailyNFT");
      expect(await dailyNFT.symbol()).to.equal("DNFT");
      expect(await dailyNFT.owner()).to.equal(owner.address);
      expect(await dailyNFT.tokenCounter()).to.equal(0n);
    });
  });

  describe("safeMint", function () {
    it("mints with URI, increments counter, and assigns ownership", async function () {
      const { dailyNFT, owner, other } = await loadFixture(deployFixture);
      const uri = "ipfs://QmExample";

      await expect(dailyNFT.safeMint(other.address, uri))
        .to.emit(dailyNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, other.address, 0n);

      expect(await dailyNFT.ownerOf(0n)).to.equal(other.address);
      expect(await dailyNFT.tokenURI(0n)).to.equal(uri);
      expect(await dailyNFT.tokenCounter()).to.equal(1n);
    });

    it("mints sequential token ids", async function () {
      const { dailyNFT, owner } = await loadFixture(deployFixture);

      await dailyNFT.safeMint(owner.address, "ipfs://a");
      await dailyNFT.safeMint(owner.address, "ipfs://b");

      expect(await dailyNFT.tokenURI(0n)).to.equal("ipfs://a");
      expect(await dailyNFT.tokenURI(1n)).to.equal("ipfs://b");
      expect(await dailyNFT.tokenCounter()).to.equal(2n);
    });

    it("reverts when caller is not the owner", async function () {
      const { dailyNFT, other } = await loadFixture(deployFixture);

      await expect(
        dailyNFT.connect(other).safeMint(other.address, "ipfs://x")
      )
        .to.be.revertedWithCustomError(dailyNFT, "OwnableUnauthorizedAccount")
        .withArgs(other.address);
    });
  });
});
