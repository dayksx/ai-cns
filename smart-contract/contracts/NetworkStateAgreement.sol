//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

contract NetworkStateAgreement {
    address public owner; // Owner of the contract
    string public constitutionHash; // IPFS hash pointing to the constitution document
    mapping(address => bool) public hasAgreed; // Mapping of users who have signed the agreement
    mapping(string => bool) public userProfileTypeAllowedList; // Mapping of allowed user profile types
    mapping(address => string) public userProfileType; // Mapping of users to their profile type
    mapping(string => bool) public userNatureAgentAllowedList; // Mapping of allowed user nature agents
    mapping(address => string) public userNatureAgent; // Mapping of users to their nature agent

    event AgreementSigned(
        address indexed user,
        string userProfileType,
        string userNatureAgent,
        string constitutionHash,
        uint256 timestamp
    );
    event ConstitutionUpdated(string newHash, uint256 timestamp);

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
     * @param _constitutionHash The hash of the constitution to be stored in the contract.
     */
    constructor(string memory _constitutionHash) {
        owner = msg.sender;
        userProfileTypeAllowedList["maker"] = true;
        userProfileTypeAllowedList["instigator"] = true;
        userProfileTypeAllowedList["investor"] = true;
        userNatureAgentAllowedList["AI"] = true;
        userNatureAgentAllowedList["human"] = true;
        constitutionHash = _constitutionHash;
    }

    /**
     * @notice Allows a user to sign the agreement.
     * @dev This function records the user's agreement and emits an AgreementSigned event.
     * @param _userProfileType The profile type of the user signing the agreement.
     * @param _userNatureAgent The nature agent of the user signing the agreement.
     */
    function signAgreement(string memory _userProfileType, string memory _userNatureAgent) public {
        require(!hasAgreed[msg.sender], "Agreement already signed");
        require(userProfileTypeAllowedList[_userProfileType], "Invalid profile type");
        require(userNatureAgentAllowedList[_userNatureAgent], "Invalid nature agent");
        hasAgreed[msg.sender] = true;
        userProfileType[msg.sender] = _userProfileType;
        userNatureAgent[msg.sender] = _userNatureAgent;
        emit AgreementSigned(msg.sender, _userProfileType, _userNatureAgent, constitutionHash, block.timestamp);
    }

    /**
     * @notice Updates the constitution hash of the network state agreement.
     * @dev This function can only be called by the owner of the contract.
     * @param _constitutionHash The new hash of the constitution to be updated.
     */
    function updateConstitution(string memory _constitutionHash) public onlyOwner {
        constitutionHash = _constitutionHash;
        emit ConstitutionUpdated(_constitutionHash, block.timestamp);
    }
}
