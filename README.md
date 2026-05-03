# daily-nft-bot

Hardhat project with an ERC-721 `DailyNFT` contract and a daily bot that:
- generates a daily GIF via `generate_gif.js`
- uploads the GIF to Pinata via `upload_to_pinata.js`
- mints a daily NFT via `scripts/mint_and_list.js`

## Setup

1. Install dependencies:
```shell
npm install
```

2. Configure `.env` with the required values:
```ini
PINATA_API_KEY=...
PINATA_SECRET_API_KEY=...
PRIVATE_KEY=...
RPC_URL=...
CONTRACT_ADDRESS=...
SEPOLIA_RPC_URL=...
```

3. Run the project locally:
```shell
node generate_gif.js
node upload_to_pinata.js
node scripts/mint_and_list.js
```

## GitHub Actions

The workflow at `.github/workflows/daily.yml` runs daily and manually via `workflow_dispatch`.
It expects the same secrets in GitHub Actions:
- `PRIVATE_KEY`
- `RPC_URL` for mainnet minting
- `CONTRACT_ADDRESS`
- `PINATA_API_KEY`
- `PINATA_SECRET_API_KEY`

For testnet runs only, set:
```ini
USE_SEPOLIA=true
SEPOLIA_RPC_URL=...
```

## Notes

- `scripts/mint_and_list.js` now defaults to `RPC_URL` for mainnet minting.
- Use `USE_SEPOLIA=true` to explicitly run on Sepolia.
- `generate_gif.js` has been updated for current Puppeteer/canvas compatibility.
- `form-data` is now included as a direct dependency required by `upload_to_pinata.js`.
- The on-chain mint worked successfully in the current environment, and the wallet is confirmed as the contract owner.
- Ensure the wallet funded by `PRIVATE_KEY` has enough ETH for minting on the selected network.

## Hardhat commands

```shell
npx hardhat compile
npm test
npx hardhat ignition deploy ./ignition/modules/DailyNFT.js
```
