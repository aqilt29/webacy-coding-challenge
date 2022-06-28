// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "src/SomeWordsClub.sol";

contract ContractTest is Test {
  SomeWordsClub public someWordsClub;
  string public defaultUri = "ipfs://QmcGda9o8iy5tB197fG8tVF4HzWPrbxHY4psu17gog2jX4/";

  function setUp() public {
    someWordsClub = new SomeWordsClub(defaultUri);
  }

  function testUri() public {
    string memory foundUri = someWordsClub.uri(0);
    console2.log(foundUri, "<== foundUri");

    assertTrue(keccak256(bytes(foundUri)) == keccak256(bytes("ipfs://QmcGda9o8iy5tB197fG8tVF4HzWPrbxHY4psu17gog2jX4/0.json")));
  }

  function testFailUriOutOfBounds() public view {
    someWordsClub.uri(10);
  }

}
