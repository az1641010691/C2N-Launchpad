// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Reward Token", "RTK") Ownable(initialOwner) {
        _mint(msg.sender, 1000000 * (10 ** decimals())); // Mint tokens
    }

    function mint(address to,uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}