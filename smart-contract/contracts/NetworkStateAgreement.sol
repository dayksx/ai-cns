//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

contract NetworkStateAgreement {
    struct UserInfo {
        string userProfileType;
        string userNatureAgent;
        bool hasAgreed;
    }

    string[] public userProfileTypeAllowedList = ["maker", "instigator", "investor"]; // Allowed user profile types
    string[] public userNatureAgentAllowedList = ["AI", "human"]; // Allowed user nature agents

    address public owner; // Owner of the contract
    string public constitutionURL; // URL pointing to the constitution document
    mapping(address => UserInfo) public userInformation; // Mapping of users to their information

    event AgreementSigned(
        address indexed user,
        string userProfileType,
        string userNatureAgent,
        string constitutionURL,
        uint256 timestamp
    );
    event ConstitutionUpdated(string newURL, uint256 timestamp);

    /**
     * @dev Modifier to make a function callable only by the owner.
     * Reverts with a custom error message if the caller is not the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /**
     * @dev Constructor for the NetworkStateAgreement contract.
     * @param _constitutionURL The URL of the constitution document.
     *
     * Initializes the contract by setting the owner to the address that deploys the contract.
     * The constitutionURL is set to the provided _constitutionURL.
     */
    constructor(string memory _constitutionURL) {
        owner = msg.sender;
        constitutionURL = _constitutionURL;
    }

    /**
     * @notice Allows a user to sign the network state agreement.
     * @param _userProfileType The profile type of the user signing the agreement.
     * @param _userNatureAgent The nature agent of the user signing the agreement.
     * @dev This function requires that the user has not already signed the agreement,
     *      the provided profile type is allowed, and the provided nature agent is allowed.
     *      It updates the user's information and emits an AgreementSigned event.
     */
    function signAgreement(string memory _userProfileType, string memory _userNatureAgent) public {
        require(!userInformation[msg.sender].hasAgreed, "Agreement already signed");
        require(isValidProfileType(_userProfileType), "Invalid profile type");
        require(isValidNatureAgent(_userNatureAgent), "Invalid nature agent");

        userInformation[msg.sender] = UserInfo({
            userProfileType: _userProfileType,
            userNatureAgent: _userNatureAgent,
            hasAgreed: true
        });
        emit AgreementSigned(msg.sender, _userProfileType, _userNatureAgent, constitutionURL, block.timestamp);
    }

    /**
     * @dev Checks if the given profile type is valid.
     * @param _profileType The profile type to check.
     * @return bool Returns true if the profile type is in the allowed list, false otherwise.
     */
    function isValidProfileType(string memory _profileType) internal view returns (bool) {
        for (uint256 i = 0; i < userProfileTypeAllowedList.length; i++) {
            if (
                keccak256(abi.encodePacked(userProfileTypeAllowedList[i])) == keccak256(abi.encodePacked(_profileType))
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Checks if the provided nature agent is valid by comparing it against the allowed list.
     * @param _natureAgent The nature agent to be validated.
     * @return bool Returns true if the nature agent is in the allowed list, otherwise false.
     */
    function isValidNatureAgent(string memory _natureAgent) internal view returns (bool) {
        for (uint256 i = 0; i < userNatureAgentAllowedList.length; i++) {
            if (
                keccak256(abi.encodePacked(userNatureAgentAllowedList[i])) == keccak256(abi.encodePacked(_natureAgent))
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Updates the URL of the constitution.
     * @dev This function can only be called by the owner of the contract.
     * @param _constitutionURL The new URL of the constitution.
     */
    function updateConstitutionURL(string memory _constitutionURL) public onlyOwner {
        constitutionURL = _constitutionURL;
        emit ConstitutionUpdated(_constitutionURL, block.timestamp);
    }
}
