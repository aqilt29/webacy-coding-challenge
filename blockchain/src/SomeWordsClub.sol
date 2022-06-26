// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";

contract SomeWordsClub is ERC1155 {

  constructor() ERC1155("ipfs://QmcGda9o8iy5tB197fG8tVF4HzWPrbxHY4psu17gog2jX4") {
    
  }

}
