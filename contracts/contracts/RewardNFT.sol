// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardNFT
 * @dev ERC721 NFT representing badges and achievements in the GasLess Guilds system
 * Only authorized contracts (guilds) can mint NFTs
 */
contract RewardNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    mapping(address => bool) public authorizedMinters;
    mapping(uint256 => string) public badgeMetadata;
    address public factory;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event BadgeMinted(address indexed to, uint256 indexed tokenId, string badgeName);

    constructor(address initialOwner) ERC721("GasLess Guild Badges", "GGB") Ownable(initialOwner) {}

    /**
     * @dev Set the factory address (can only be set once)
     */
    function setFactory(address _factory) external onlyOwner {
        require(factory == address(0), "RewardNFT: Factory already set");
        factory = _factory;
    }

    /**
     * @dev Add an authorized minter (typically a Guild contract)
     * Can be called by owner or factory
     */
    function addMinter(address minter) external {
        require(msg.sender == owner() || msg.sender == factory, "RewardNFT: Not authorized");
        authorizedMinters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev Remove an authorized minter
     */
    function removeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev Mint a badge NFT to a recipient (only authorized minters)
     */
    function mintBadge(
        address to,
        string memory badgeName,
        string memory tokenURI
    ) external returns (uint256) {
        require(authorizedMinters[msg.sender], "RewardNFT: Not authorized to mint");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        badgeMetadata[newTokenId] = badgeName;
        
        emit BadgeMinted(to, newTokenId, badgeName);
        return newTokenId;
    }

    /**
     * @dev Get all token IDs owned by an address
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;
        
        // Note: This is inefficient for large token counts
        // In production, consider using EnumerableSet or tracking tokens per owner
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (_ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
                if (index >= balance) break;
            }
        }
        
        return tokens;
    }

    /**
     * @dev Get badge name for a token ID
     */
    function getBadgeName(uint256 tokenId) external view returns (string memory) {
        return badgeMetadata[tokenId];
    }
}

