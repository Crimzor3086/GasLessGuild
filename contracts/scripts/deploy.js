const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy RewardToken
  console.log("\nDeploying RewardToken...");
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("RewardToken deployed to:", rewardTokenAddress);

  // Deploy RewardNFT
  console.log("\nDeploying RewardNFT...");
  const RewardNFT = await hre.ethers.getContractFactory("RewardNFT");
  const rewardNFT = await RewardNFT.deploy(deployer.address);
  await rewardNFT.waitForDeployment();
  const rewardNFTAddress = await rewardNFT.getAddress();
  console.log("RewardNFT deployed to:", rewardNFTAddress);

  // Deploy GuildFactory
  console.log("\nDeploying GuildFactory...");
  const GuildFactory = await hre.ethers.getContractFactory("GuildFactory");
  const guildFactory = await GuildFactory.deploy(rewardTokenAddress, rewardNFTAddress);
  await guildFactory.waitForDeployment();
  const guildFactoryAddress = await guildFactory.getAddress();
  console.log("GuildFactory deployed to:", guildFactoryAddress);

  // Set factory address in token contracts so it can authorize new guilds
  console.log("\nSetting factory address in token contracts...");
  await rewardToken.setFactory(guildFactoryAddress);
  await rewardNFT.setFactory(guildFactoryAddress);
  console.log("Factory address set");

  console.log("\n=== Deployment Summary ===");
  console.log("RewardToken:", rewardTokenAddress);
  console.log("RewardNFT:", rewardNFTAddress);
  console.log("GuildFactory:", guildFactoryAddress);
  console.log("\nAdd these addresses to your .env file:");
  console.log(`VITE_REWARD_TOKEN_ADDRESS=${rewardTokenAddress}`);
  console.log(`VITE_REWARD_NFT_ADDRESS=${rewardNFTAddress}`);
  console.log(`VITE_GUILD_FACTORY_ADDRESS=${guildFactoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

