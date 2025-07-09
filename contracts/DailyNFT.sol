// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DailyNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("DailyNFT", "DNFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        tokenCounter += 1;
    }
}
