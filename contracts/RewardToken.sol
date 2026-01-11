// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC20 token representing reputation points (REP) in the GasLess Guilds system
 * Only authorized contracts (guilds) can mint tokens
 */
contract RewardToken is ERC20, Ownable {
    mapping(address => bool) public authorizedMinters;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    constructor(address initialOwner) ERC20("GasLess Guild Reputation", "REP") Ownable(initialOwner) {}

    /**
     * @dev Add an authorized minter (typically a Guild contract)
     */
    function addMinter(address minter) external onlyOwner {
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
     * @dev Mint tokens to a recipient (only authorized minters)
     */
    function mint(address to, uint256 amount) external {
        require(authorizedMinters[msg.sender], "RewardToken: Not authorized to mint");
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from a user's balance
     */
    function burn(address from, uint256 amount) external {
        require(authorizedMinters[msg.sender], "RewardToken: Not authorized to burn");
        _burn(from, amount);
    }
}

