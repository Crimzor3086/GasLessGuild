// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RewardToken.sol";
import "./RewardNFT.sol";

/**
 * @title Guild
 * @dev Represents a single guild in the GasLess Guilds system
 * Handles membership, tasks, and reward distribution
 */
contract Guild is Ownable {
    struct Task {
        string title;
        string description;
        uint256 rewardPoints;
        bool rewardNFT;
        bool completed;
        address creator;
        address completer;
        uint256 completionTime;
    }

    string public name;
    string public description;
    string public category;
    address public master;
    
    RewardToken public rewardToken;
    RewardNFT public rewardNFT;
    
    mapping(address => bool) public members;
    mapping(address => uint256) public memberReputation;
    mapping(uint256 => Task) public tasks;
    mapping(address => mapping(uint256 => bool)) public taskCompletions; // member => taskId => completed
    
    uint256 public taskCount;
    uint256 public memberCount;

    event MemberJoined(address indexed member);
    event TaskCreated(uint256 indexed taskId, string title, address indexed creator);
    event TaskCompleted(uint256 indexed taskId, address indexed completer, uint256 rewardPoints, bool rewardNFT);

    constructor(
        string memory _name,
        string memory _description,
        string memory _category,
        address _master,
        address _rewardToken,
        address _rewardNFT
    ) Ownable(_master) {
        name = _name;
        description = _description;
        category = _category;
        master = _master;
        rewardToken = RewardToken(_rewardToken);
        rewardNFT = RewardNFT(_rewardNFT);
        
        // Master is automatically a member
        members[_master] = true;
        memberCount = 1;
    }

    /**
     * @dev Join the guild
     */
    function joinGuild() external {
        require(!members[msg.sender], "Guild: Already a member");
        members[msg.sender] = true;
        memberCount++;
        emit MemberJoined(msg.sender);
    }

    /**
     * @dev Check if an address is a member
     */
    function isMember(address member) external view returns (bool) {
        return members[member];
    }

    /**
     * @dev Create a new task (only master or owner)
     */
    function createTask(
        string memory title,
        string memory description,
        uint256 rewardPoints,
        bool rewardNFT
    ) external onlyOwner {
        taskCount++;
        tasks[taskCount] = Task({
            title: title,
            description: description,
            rewardPoints: rewardPoints,
            rewardNFT: rewardNFT,
            completed: false,
            creator: msg.sender,
            completer: address(0),
            completionTime: 0
        });
        
        emit TaskCreated(taskCount, title, msg.sender);
    }

    /**
     * @dev Complete a task
     */
    function completeTask(uint256 taskId) external {
        require(members[msg.sender], "Guild: Not a member");
        require(taskId > 0 && taskId <= taskCount, "Guild: Invalid task ID");
        require(!tasks[taskId].completed, "Guild: Task already completed");
        require(!taskCompletions[msg.sender][taskId], "Guild: Already completed this task");

        Task storage task = tasks[taskId];
        task.completed = true;
        task.completer = msg.sender;
        task.completionTime = block.timestamp;
        taskCompletions[msg.sender][taskId] = true;

        // Award reputation points
        if (task.rewardPoints > 0) {
            rewardToken.mint(msg.sender, task.rewardPoints);
            memberReputation[msg.sender] += task.rewardPoints;
        }

        // Award NFT badge if applicable
        if (task.rewardNFT) {
            string memory badgeName = string(abi.encodePacked("Task: ", task.title));
            string memory tokenURI = string(abi.encodePacked("https://gaslessguilds.io/badge/", toString(taskId)));
            rewardNFT.mintBadge(msg.sender, badgeName, tokenURI);
        }

        emit TaskCompleted(taskId, msg.sender, task.rewardPoints, task.rewardNFT);
    }

    /**
     * @dev Get task details
     */
    function getTask(uint256 taskId) external view returns (
        string memory title,
        string memory description,
        uint256 rewardPoints,
        bool rewardNFT,
        bool completed,
        address creator
    ) {
        require(taskId > 0 && taskId <= taskCount, "Guild: Invalid task ID");
        Task memory task = tasks[taskId];
        return (
            task.title,
            task.description,
            task.rewardPoints,
            task.rewardNFT,
            task.completed,
            task.creator
        );
    }

    /**
     * @dev Get total number of tasks
     */
    function getTaskCount() external view returns (uint256) {
        return taskCount;
    }

    /**
     * @dev Get member's reputation
     */
    function getMemberReputation(address member) external view returns (uint256) {
        return memberReputation[member];
    }

    /**
     * @dev Helper function to convert uint to string
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

