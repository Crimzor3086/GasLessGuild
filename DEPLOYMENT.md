# Deployment Information

## Contract Addresses (Arbitrum Sepolia Testnet)

- **GuildFactory**: `0x80bBdD4D4606DF5Ba6561e4B9C4a59B49061f713`
- **RewardToken (REP)**: `0xc5645f895a48c8A572368AaFeaAb2D42d1203819`
- **RewardNFT**: `0x647F8C626a90b5b8D4A69723bB672C759DD8A027`

## Deployer Address

- **Address**: `0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f`

## Network

- **Network**: Arbitrum Sepolia Testnet
- **RPC URL**: https://sepolia-rollup.arbitrum.io/rpc
- **Explorer**: https://sepolia.arbiscan.io/

## View on Arbiscan

- [GuildFactory](https://sepolia.arbiscan.io/address/0x80bBdD4D4606DF5Ba6561e4B9C4a59B49061f713)
- [RewardToken](https://sepolia.arbiscan.io/address/0xc5645f895a48c8A572368AaFeaAb2D42d1203819)
- [RewardNFT](https://sepolia.arbiscan.io/address/0x647F8C626a90b5b8D4A69723bB672C759DD8A027)

## Environment Variables

The following environment variables have been set in `.env`:

```env
VITE_GUILD_FACTORY_ADDRESS=0x80bBdD4D4606DF5Ba6561e4B9C4a59B49061f713
VITE_REWARD_TOKEN_ADDRESS=0xc5645f895a48c8A572368AaFeaAb2D42d1203819
VITE_REWARD_NFT_ADDRESS=0x647F8C626a90b5b8D4A69723bB672C759DD8A027
```

## Next Steps

1. Make sure your wallet is connected to Arbitrum Sepolia testnet
2. Get some testnet ETH from an Arbitrum Sepolia faucet
3. Start the frontend: `npm run dev`
4. Connect your wallet and start creating guilds!

## Mainnet Deployment

To deploy to Arbitrum mainnet, run:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network arbitrum
```

Make sure you have:
- Sufficient ETH in your deployer wallet
- Updated `.env` file with mainnet RPC URL
- Updated frontend `.env` with new contract addresses

