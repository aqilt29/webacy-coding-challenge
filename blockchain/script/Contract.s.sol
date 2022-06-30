// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "../src/SomeWordsClub.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();
        SomeWordsClub someWordsClub = new SomeWordsClub("ipfs://QmcGda9o8iy5tB197fG8tVF4HzWPrbxHY4psu17gog2jX4/");
    }
}
