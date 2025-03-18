//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

contract NetworkStateInitiatives {
    // Struct to store initiatives properties
    struct Initiative {
        bytes32 id;
        address instigator;
        string title;
        string description;
        string category;
        string[] tags;
        uint256 timestamp;
    }

    address public owner; // Owner of the contract
    Initiative[] public initiatives; // Array of initiatives

    // Event emitted when a new initiative is created
    event InitiativeCreated(
        bytes32 initiativeId,
        address instigator,
        string title,
        string description,
        string category
    );

    /**
     * @dev Modifier to make a function callable only by the owner.
     * Reverts with a custom error message if the caller is not the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /**
     * @dev Constructor that sets the initial constitution hash and assigns the contract owner.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Creates a new initiative with the given details and stores it in the initiatives array.
     * @param _title The title of the initiative.
     * @param _description A brief description of the initiative.
     * @param _category The category under which the initiative falls.
     * @param _tags An array of tags associated with the initiative.
     */
    function createInitiatives(
        address _instigator,
        string memory _title,
        string memory _description,
        string memory _category,
        string[] memory _tags
    ) public {
        bytes32 initiativeId = generateUUID();
        Initiative memory newInitiative = Initiative({
            id: initiativeId,
            instigator: _instigator,
            title: _title,
            description: _description,
            category: _category,
            tags: _tags,
            timestamp: block.timestamp
        });
        initiatives.push(newInitiative);
        emit InitiativeCreated(initiativeId, _instigator, _title, _description, _category);
    }

    /**
     * @dev Generates a unique identifier (UUID) based on the current block's timestamp,
     * previous block's random number, sender's address, and the hash of the previous block.
     * This method is an acceptable pseudo-random and deterministic function for generating our UUIDs.
     * @return bytes32 A unique identifier generated using keccak256 hash function.
     */
    function generateUUID() public view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, blockhash(block.number - 1)));
    }
}
