// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Guild.sol";
import "./RewardToken.sol";
import "./RewardNFT.sol";

/**
 * @title GuildFactory
 * @dev Factory contract for creating new Guild instances
 * Manages the creation and tracking of all guilds in the system
 */
contract GuildFactory {
    address public rewardToken;
    address public rewardNFT;
    address[] public guilds;
    
    mapping(address => GuildInfo) public guildInfo;
    mapping(address => bool) public isGuild;

    struct GuildInfo {
        string name;
        string description;
        string category;
        address master;
        uint256 memberCount;
    }

    event GuildCreated(address indexed guildAddress, string name, address indexed master);
    event GuildRemoved(address indexed guildAddress, address indexed master);

    constructor(address _rewardToken, address _rewardNFT) {
        rewardToken = _rewardToken;
        rewardNFT = _rewardNFT;
    }

    /**
     * @dev Create a new guild
     */
    function createGuild(
        string memory name,
        string memory description,
        string memory category
    ) external returns (address) {
        Guild newGuild = new Guild(
            name,
            description,
            category,
            msg.sender,
            rewardToken,
            rewardNFT
        );

        address guildAddress = address(newGuild);
        guilds.push(guildAddress);
        isGuild[guildAddress] = true;
        
        guildInfo[guildAddress] = GuildInfo({
            name: name,
            description: description,
            category: category,
            master: msg.sender,
            memberCount: 1 // Master is first member
        });

        // Authorize the new guild to mint tokens and NFTs
        RewardToken(rewardToken).addMinter(guildAddress);
        RewardNFT(rewardNFT).addMinter(guildAddress);

        emit GuildCreated(guildAddress, name, msg.sender);
        return guildAddress;
    }

    /**
     * @dev Get all guild addresses
     */
    function getAllGuilds() external view returns (address[] memory) {
        return guilds;
    }

    /**
     * @dev Get guild information
     */
    function getGuildInfo(address guildAddress) external view returns (
        string memory name,
        string memory description,
        string memory category,
        address master,
        uint256 memberCount
    ) {
        require(isGuild[guildAddress], "GuildFactory: Invalid guild address");
        GuildInfo memory info = guildInfo[guildAddress];
        
        // Update member count from the actual guild contract
        Guild guild = Guild(guildAddress);
        uint256 currentMemberCount = guild.memberCount();
        
        return (
            info.name,
            info.description,
            info.category,
            info.master,
            currentMemberCount
        );
    }

    /**
     * @dev Get total number of guilds
     */
    function getGuildCount() external view returns (uint256) {
        return guilds.length;
    }

    /**
     * @dev Remove a guild (only by the guild master)
     * Note: This doesn't delete the guild contract, just removes it from the factory's list
     */
    function removeGuild(address guildAddress) external {
        require(isGuild[guildAddress], "GuildFactory: Invalid guild address");
        GuildInfo memory info = guildInfo[guildAddress];
        require(info.master == msg.sender, "GuildFactory: Only the guild master can remove the guild");
        
        // Remove from mapping
        isGuild[guildAddress] = false;
        
        // Remove from array (swap with last element and pop)
        for (uint256 i = 0; i < guilds.length; i++) {
            if (guilds[i] == guildAddress) {
                guilds[i] = guilds[guilds.length - 1];
                guilds.pop();
                break;
            }
        }
        
        // Remove guild info
        delete guildInfo[guildAddress];
        
        // Remove minter permissions
        RewardToken(rewardToken).removeMinter(guildAddress);
        RewardNFT(rewardNFT).removeMinter(guildAddress);
        
        emit GuildRemoved(guildAddress, msg.sender);
    }
}

