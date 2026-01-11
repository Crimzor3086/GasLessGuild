# Deployment Notes

## Important: Guild Removal Feature

The `removeGuild` function requires that the deployed contracts have the updated `removeMinter` functions in both `RewardToken` and `RewardNFT` contracts.

### Required Contract Updates

Both `RewardToken.sol` and `RewardNFT.sol` must have the updated `removeMinter` function that allows the factory to call it:

```solidity
function removeMinter(address minter) external {
    require(msg.sender == owner() || msg.sender == factory, "Not authorized");
    authorizedMinters[minter] = false;
    emit MinterRemoved(minter);
}
```

**NOT** the old version:
```solidity
function removeMinter(address minter) external onlyOwner {
    // This won't work - factory can't call it
}
```

### Deployment Steps

1. **Re-deploy all contracts** with the updated code:
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network arbitrumSepolia
   ```

2. **Update `.env` file** with new contract addresses:
   ```
   VITE_GUILD_FACTORY_ADDRESS=0x...
   VITE_REWARD_TOKEN_ADDRESS=0x...
   VITE_REWARD_NFT_ADDRESS=0x...
   ```

3. **Set factory address** in token contracts (if not done automatically):
   - Call `setFactory(guildFactoryAddress)` on both RewardToken and RewardNFT

### Troubleshooting

If you see extremely high gas fees when trying to remove a guild:
- The contracts likely need to be re-deployed with the updated `removeMinter` functions
- The factory must be authorized to call `removeMinter` on both token contracts
- Verify that `factory` variable is set correctly in RewardToken and RewardNFT contracts

### Testing

After deployment, test guild removal:
1. Create a guild (as master)
2. Try to remove it
3. If gas estimation fails, check contract permissions

