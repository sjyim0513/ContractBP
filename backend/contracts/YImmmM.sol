//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IERC20 {
  function balanceOf(address account) external view returns (uint256);
  function name() external view returns (string memory);
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);
}

contract YImmmM {
  mapping(address => uint256) public _balances;
  uint256[5] public staticArray = [100, 200, 300];
  uint256[] public dynamicArray = [3, 2, 1];

  // constructor() {
  //     INITIALIZATIONS
  // };

  function getBalance(address tokenAddress, address account) public view returns (uint256 balance) {
            IERC20 token = IERC20(tokenAddress); 
            return token.balanceOf(account);
        }
  function getTokenInfo(address tokenAddress) public view returns (string memory name, string memory symbol, uint8 decimals) {
            IERC20 token = IERC20(tokenAddress);
            string memory tokenName = token.name();
            string memory tokenSymbol = token.symbol();
            uint8 tokenDecimals = token.decimals();
            return (tokenName, tokenSymbol, tokenDecimals);
        }
}
