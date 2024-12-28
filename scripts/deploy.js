const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const RewardToken = await hre.ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy(deployer.address);
    await rewardToken.waitForDeployment();
    console.log("RewardToken deployed to:", await rewardToken.getAddress());

    const LiquidityPoolManager = await hre.ethers.getContractFactory("LiquidityPoolManager");
    const lpManager = await LiquidityPoolManager.deploy(
        await rewardToken.getAddress(),
        await rewardToken.getAddress()
    );
    await lpManager.waitForDeployment();
    console.log("LiquidityPoolManager deployed to:", await lpManager.getAddress());

    // 保存地址到文件
    fs.writeFileSync("deployedAddresses.json", JSON.stringify({
        RewardToken: await rewardToken.getAddress(),
        LiquidityPoolManager: await lpManager.getAddress()
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
