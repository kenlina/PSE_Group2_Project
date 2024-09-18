// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MyContract {
    uint public value;
    address public owner;
    constructor() {
        owner = msg.sender;
        value = 10;
    }

    function setValue(uint _value) public {
        require(_value > value, "assigned value is lees than current value");
        value = _value;
    }

    function showValue() public view returns (uint) {
        return value;
    }
}