//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

contract HelloNetizen {
    string private hello;

    constructor(string memory _hello) {
        hello = _hello;
    }

    function say() public view returns (string memory) {
        return hello;
    }

    function setHello(string memory _hello) public {
        hello = _hello;
    }
}
