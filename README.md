# GasLess Guilds

A lightweight decentralized application built on Arbitrum that enables communities, DAOs, and online groups to reward members for participation without forcing users to worry about gas fees or complex onboarding.

## Features

- **Zero Gas Fees**: Community rewards without the cost
- **On-Chain Trust**: Verified reputation on Arbitrum
- **DAO Powered**: Decentralized guild governance
- **Guild Management**: Create and manage guilds with custom tasks
- **Reward System**: Earn reputation points (REP) and NFT badges
- **Task Completion**: Complete tasks to build your on-chain reputation

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- Wagmi & Viem for blockchain interactions

### Smart Contracts
- Solidity ^0.8.20
- OpenZeppelin Contracts
- Hardhat for development and deployment

## Project Structure

```
gaslessguild/
├── contracts/          # Smart contracts
│   ├── Guild.sol       # Individual guild contract
│   ├── GuildFactory.sol # Factory for creating guilds
│   ├── RewardToken.sol # ERC20 reputation token
│   └── RewardNFT.sol   # ERC721 badge NFTs
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks for blockchain
│   ├── lib/            # Utilities and config
│   └── pages/          # Page components
└── public/             # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A wallet (MetaMask recommended)
- Access to Arbitrum network (mainnet or Sepolia testnet)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gaslessguild
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install contract dependencies:
```bash
cd contracts
npm install
```

### Configuration

1. Create a `.env` file in the root directory:
```env
VITE_GUILD_FACTORY_ADDRESS=0x...
VITE_REWARD_TOKEN_ADDRESS=0x...
VITE_REWARD_NFT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=your-project-id
```

2. Create a `.env` file in the `contracts/` directory:
```env
PRIVATE_KEY=your-private-key
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=your-arbiscan-api-key
```

### Development

1. Start the frontend development server:
```bash
npm run dev
```

2. Compile contracts:
```bash
cd contracts
npm run compile
```

3. Deploy contracts (to Arbitrum Sepolia testnet):
```bash
cd contracts
npm run deploy:arbitrum-sepolia
```

After deployment, update the contract addresses in your `.env` file.

### Building

Build the frontend for production:
```bash
npm run build
```

## Smart Contracts

### GuildFactory
Factory contract that creates and manages all guilds in the system.

### Guild
Individual guild contract that handles:
- Membership management
- Task creation and completion
- Reward distribution (REP tokens and NFTs)

### RewardToken (REP)
ERC20 token representing reputation points. Only authorized guilds can mint tokens.

### RewardNFT
ERC721 NFT contract for badges and achievements. Only authorized guilds can mint NFTs.

## Usage

1. **Connect Wallet**: Click "Connect Wallet" in the navbar
2. **Create Guild**: Navigate to Dashboard and click "Create Guild"
3. **Join Guild**: Click on any guild card to view and join
4. **Complete Tasks**: View tasks in a guild and complete them to earn rewards
5. **View Profile**: Check your reputation points and NFT badges

## Network Support

- Arbitrum One (Mainnet)
- Arbitrum Sepolia (Testnet)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

