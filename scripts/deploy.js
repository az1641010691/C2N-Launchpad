const hre = require("hardhat");

async function main() {
    //获取部署账户
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    //部署RewardToken合约
    const RewardToken = await hre.ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy(deployer.address); // 传递构造函数参数
    await rewardToken.deployed();
    console.log("RewardToken deployed to:", rewardToken.address);

    //deploy LiquidityPoolManager合约
    const LiquidityPoolManager = await hre.ethers.getContractFactory("LiquidityPoolManager");
    const lpManager = await LiquidityPoolManager.deploy(rewardToken.address); // 传递构造函数参数
    await lpManager.deployed();
    console.log("LiquidityPoolManager deployed to:", lpManager.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});