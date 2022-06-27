// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

contract SomeWordsClub is ERC1155 {
  using Strings for uint256;

  uint256 public constant CLOUD = 0;
  uint256 public constant FRIEND = 1;
  uint256 public constant WORK = 2;
  uint256 public constant PLEASURE = 3;
  uint256 public constant SUCCESS = 4;

  uint256 public constant MAX_SUPPLY = 2500;
  string public name = "Some Words Club";
  string public baseURI;

  mapping(uint256 => bool) public isValidTokenId;


  constructor(string memory _tokenUri) ERC1155(_tokenUri) {
    console2.log(_tokenUri, " <== baseUri");
    baseURI = _tokenUri;
    isValidTokenId[0] = true;
    isValidTokenId[1] = true;
    isValidTokenId[2] = true;
    isValidTokenId[3] = true;
    isValidTokenId[4] = true;
  }

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    require(isValidTokenId[tokenId] == true, "ERROR, out of bounds tokenId");
    return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
  }


}
