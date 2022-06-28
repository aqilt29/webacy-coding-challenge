// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/utils/Address.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract SomeWordsClub is ERC1155, ERC1155Supply, ReentrancyGuard, Ownable {
  using Strings for uint256;
  using Address for address;

  uint256 public constant CLOUD = 0;
  uint256 public constant FRIEND = 1;
  uint256 public constant WORK = 2;
  uint256 public constant PLEASURE = 3;
  uint256 public constant SUCCESS = 4;

  uint256 public constant MAX_SUPPLY = 2500;

  // 0.0025 ETH
  uint256 public constant MINT_PRICE = 2500000000000000;
  uint256 public MINT_LIMIT = 5;
  string public name = "Some Words Club";
  string public baseURI;

  mapping(uint256 => bool) public isValidTokenId;


  constructor(string memory _tokenUri) ERC1155(_tokenUri) {
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

  // has to mint the right NFTs
  // cant mint more than the MAX_SUPPLY of the NFTs
  // cant mint more than the MINT_LIMIT
  // has to send the right amount of money
  function mintYourWord(uint256 tokenId, uint256 numTokens) external payable nonReentrant {
    require(isValidTokenId[tokenId] == true, "ERROR, out of bounds tokenId");
    require(numTokens <= MINT_LIMIT, "ERROR, minting too many at a time");
    require((totalSupply(tokenId) + numTokens) <= MAX_SUPPLY, "ERROR, minting would go over supply limit");
    require(msg.value >= (numTokens * MINT_PRICE), "ERROR, not enough eth to buy");

    _mint(msg.sender, tokenId, numTokens, "");
  }

  function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal
    override(ERC1155, ERC1155Supply)
  {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  function withdrawBalance() external onlyOwner {
		uint256 _balance = address(this).balance;
		require(_balance > 0, "No amount to withdraw");
    console2.log(_balance, "balance in withdraw");
		Address.sendValue(payable(owner()),_balance);
  }

}
