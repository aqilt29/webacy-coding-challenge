// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "src/SomeWordsClub.sol";

contract ContractTest is Test {
  SomeWordsClub public someWordsClub;
  string public defaultUri = "ipfs://QmcGda9o8iy5tB197fG8tVF4HzWPrbxHY4psu17gog2jX4/";
  
  address constant deployerAddress = 0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84;
  address constant devAddress = 0xfD7f2bfD60a332Aedd002b2CCf1D1a213259CC95;
  address constant alice = 0x802B68893C0C316476a68554058E20C3601de3E4;

  function setUp() public {
    vm.label(alice, "Alice");
    hoax(alice, 1 ether);
    someWordsClub = new SomeWordsClub(defaultUri);
  }

  function testUri() public {
    string memory foundUri = someWordsClub.uri(0);
    assertTrue(keccak256(bytes(foundUri)) == keccak256(bytes("ipfs://QmcGda9o8iy5tB197fG8tVF4HzWPrbxHY4psu17gog2jX4/0.json")));
  }

  function testMintSomeWords() public {
    startHoax(devAddress, 1 ether);
    console2.log(devAddress.balance, "balance of hoax dev");

    someWordsClub.mintYourWord{value: 0.0125 ether}(0, 5);

    uint256 devNFTBalance = someWordsClub.balanceOf(devAddress, 0);

    assertTrue(devNFTBalance == 5);
    assertTrue(address(someWordsClub).balance == 0.0125 ether);
  }

  function testCanMintAllTheNFTs() public {
    startHoax(devAddress, 100 ether);

    for (uint i = 0; i < 500; i++) {
      someWordsClub.mintYourWord{value: 0.0125 ether}(0, 5);
      someWordsClub.mintYourWord{value: 0.0125 ether}(1, 5);
      someWordsClub.mintYourWord{value: 0.0125 ether}(2, 5);
      someWordsClub.mintYourWord{value: 0.0125 ether}(3, 5);
      someWordsClub.mintYourWord{value: 0.0125 ether}(4, 5);
    }

    assertTrue(someWordsClub.balanceOf(devAddress, 0) == 2500);
    assertTrue(someWordsClub.balanceOf(devAddress, 1) == 2500);
    assertTrue(someWordsClub.balanceOf(devAddress, 2) == 2500);
    assertTrue(someWordsClub.balanceOf(devAddress, 3) == 2500);
    assertTrue(someWordsClub.balanceOf(devAddress, 4) == 2500);
  }

  function testCanWithdrawBalance() public {
    hoax(devAddress, 1 ether);
    someWordsClub.mintYourWord{value: 0.0125 ether}(0, 5);

    assertTrue(address(someWordsClub).balance == 0.0125 ether);

    console2.log(someWordsClub.owner(), "owner");

    vm.prank(alice);
    someWordsClub.withdrawBalance();
  }

  function testFailCannotWithdrawAsNonOwner() public {
    hoax(devAddress, 1 ether);
    someWordsClub.mintYourWord{value: 0.0125 ether}(0, 5);

    someWordsClub.withdrawBalance();
  }

  function testFailMintSingleWordOverLimit () public {
    startHoax(devAddress, 10 ether);

    for (uint i = 0; i <= 500; i++) {
      someWordsClub.mintYourWord{value: 0.0125 ether}(0, 5);
    }
  }

  function testFailMintOutOfBoundsId() public {
    someWordsClub.mintYourWord(10, 5);
  }

  function testFailMintTooMany() public {
    someWordsClub.mintYourWord(0, 10);
  }

  function testFailUriOutOfBounds() public view {
    someWordsClub.uri(10);
  }

}
