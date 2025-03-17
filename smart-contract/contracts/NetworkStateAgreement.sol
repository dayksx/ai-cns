//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

contract NetworkStateAgreement {
    address public owner; // Owner of the contract
    string public constitutionHash; // IPFS hash pointing to the constitution document
    mapping(address => bool) public hasAgreed; // Mapping of users who have signed the agreement

    event AgreementSigned(address indexed user, string constitutionHash, uint256 timestamp);
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
        constitutionHash = _constitutionHash;
    }

    /**
     * @notice Allows a user to sign the agreement.
     * @dev This function checks if the user has already signed the agreement.
     * If not, it marks the user as having signed and emits an AgreementSigned event.
     */
    function signAgreement() public {
        require(!hasAgreed[msg.sender], "Agreement already signed");
        hasAgreed[msg.sender] = true;
        emit AgreementSigned(msg.sender, constitutionHash, block.timestamp);
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
