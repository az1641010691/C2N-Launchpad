require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
//如果只使用 @nomicfoundation/hardhat-ethers，虽然可以处理合约工厂和部署，但在测试时可能缺少 Chai 匹配器等功能。
//如果只使用 @nomicfoundation/hardhat-toolbox，虽然它包含了 hardhat-ethers 的功能，但未明确加载 hardhat-ethers 可能会引起特定问题。

module.exports = {
  solidity: "0.8.26",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};

