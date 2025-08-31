pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenHydrogenCredit is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("GreenHydrogenCredit", "GHC") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    event CreditMinted(address indexed to, uint256 indexed tokenId);

    function mintCredit(address to) public onlyOwner returns (uint256) {
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        emit CreditMinted(to, newTokenId);
        return newTokenId;
    }
}