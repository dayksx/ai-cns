//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

contract NetworkStateAgreement {
    address public owner; // Owner of the contract
    string public constitutionHash; // IPFS hash pointing to the constitution document

    event ConstitutionUpdated(string newHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(string memory _constitutionHash) {
        owner = msg.sender;
        constitutionHash = _constitutionHash;
    }

    function updateConstitution(string memory _constitutionHash) public onlyOwner {
        constitutionHash = _constitutionHash;
        emit ConstitutionUpdated(_constitutionHash, block.timestamp);
    }
}
