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
        string status;
        uint256 upvotes;
        uint256 downvotes;
    }

    address public owner; // Owner of the contract
    Initiative[] public initiatives; // Array of initiatives
    mapping(address => uint256) public voterTotalVotes; // Mapping to store total votes used by each voter
    uint256 public constant MAX_VOTES_PER_USER = 100; // Maximum votes allowed per user

    // Event emitted when a new initiative is created
    event InitiativeCreated(
        bytes32 initiativeId,
        address instigator,
        string title,
        string description,
        string category
    );
    // Event emitted when a up vote is casted
    event Upvoted(bytes32 initiativeId, address voter, uint256 votesNumber);
    // Event emitted when a down vote is casted
    event Downvoted(bytes32 initiativeId, address voter, uint256 votesNumber);
    // Event emitted when a status is updated
    event StatusUpdated(bytes32 initiativeId, string newStatus, uint256 timestamp);

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
     * @notice Allows the owner to create a new initiative.
     * @dev This function creates a new initiative and emits an InitiativeCreated event.
     * @param _instigator The address of the instigator creating the initiative.
     * @param _title The title of the initiative.
     * @param _description The description of the initiative.
     * @param _category The category of the initiative.
     * @param _tags The tags associated with the initiative.
     */
    function createInitiatives(
        address _instigator,
        string memory _title,
        string memory _description,
        string memory _category,
        string[] memory _tags
    ) public {
        bytes32 initiativeId = generatePseudoUUID();
        Initiative memory newInitiative = Initiative({
            id: initiativeId,
            instigator: _instigator,
            title: _title,
            description: _description,
            category: _category,
            tags: _tags,
            timestamp: block.timestamp,
            status: "IDEATION",
            upvotes: 0,
            downvotes: 0
        });
        initiatives.push(newInitiative);
        emit InitiativeCreated(initiativeId, _instigator, _title, _description, _category);
    }

    /**
     * @notice Allows a user to upvote an initiative.
     * @dev This function increments the upvotes for a specific initiative and tracks the total votes by the user.
     * @param _initiativeId The ID of the initiative to upvote.
     * @param _votesNumber The number of votes to cast for the initiative.
     */
    function upvote(bytes32 _initiativeId, uint256 _votesNumber) public {
        require(_votesNumber > 0, "Votes number must be greater than zero");
        require(
            voterTotalVotes[msg.sender] + _votesNumber <= MAX_VOTES_PER_USER,
            "Cannot exceed MAX_VOTES_PER_USER total votes"
        );
        //TODO: Call NetworkStateAgreement contract to check that the user has signed the agreement
        for (uint256 i = 0; i < initiatives.length; i++) {
            if (initiatives[i].id == _initiativeId) {
                initiatives[i].upvotes += _votesNumber;
                voterTotalVotes[msg.sender] += _votesNumber;
                emit Upvoted(_initiativeId, msg.sender, _votesNumber);
                break;
            }
        }
    }

    /**
     * @notice Allows a user to downvote an initiative.
     * @dev This function increments the downvotes for a specific initiative and updates the total votes of the voter.
     * It ensures that the number of votes is greater than zero and does not exceed the maximum allowed votes per
     * user. It also emits a Downvoted event upon successful downvoting.
     * @param _initiativeId The unique identifier of the initiative to be downvoted.
     * @param _votesNumber The number of votes to be added to the downvotes of the initiative.
     */
    function downvote(bytes32 _initiativeId, uint256 _votesNumber) public {
        require(_votesNumber > 0, "Votes number must be greater than zero");
        require(
            voterTotalVotes[msg.sender] + _votesNumber <= MAX_VOTES_PER_USER,
            "Cannot exceed MAX_VOTES_PER_USER total votes"
        );
        //TODO: Call NetworkStateAgreement contract to check that the user has signed the agreement
        for (uint256 i = 0; i < initiatives.length; i++) {
            if (initiatives[i].id == _initiativeId) {
                initiatives[i].downvotes += _votesNumber;
                voterTotalVotes[msg.sender] += _votesNumber;
                emit Downvoted(_initiativeId, msg.sender, _votesNumber);
                break;
            }
        }
    }

    /**
     * @notice Updates the status of an initiative.
     * @dev This function can only be called by the owner of the contract.
     * @param _initiativeId The unique identifier of the initiative to update.
     * @param _newStatus The new status to set for the initiative.
     */
    function updateStatus(bytes32 _initiativeId, string memory _newStatus) public onlyOwner {
        for (uint256 i = 0; i < initiatives.length; i++) {
            if (initiatives[i].id == _initiativeId) {
                initiatives[i].status = _newStatus;
                emit StatusUpdated(_initiativeId, _newStatus, block.timestamp);
                break;
            }
        }
    }

    /**
     * @dev Generates a unique identifier (UUID) based on the current block's timestamp,
     * previous block's random number, sender's address, and the hash of the previous block.
     * This method is an acceptable pseudo-random and deterministic function for generating our UUIDs.
     * @return bytes32 A unique identifier generated using keccak256 hash function.
     */
    function generatePseudoUUID() public view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, blockhash(block.number - 1)));
    }
}
