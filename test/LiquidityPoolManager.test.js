const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");

describe("LiquidityPoolManager Contract Tests", function () {
    let rewardToken, liquidityPoolManager, deployer;

    before(async () => {
        [deployer] = await ethers.getSigners();

        // 加载部署的合约地址
        const deployedAddresses = JSON.parse(fs.readFileSync("./deployedAddresses.json"));

        // 获取合约实例
        const RewardToken = await ethers.getContractFactory("RewardToken");
        rewardToken = await RewardToken.attach(deployedAddresses.RewardToken);

        const LiquidityPoolManager = await ethers.getContractFactory("LiquidityPoolManager");
        liquidityPoolManager = await LiquidityPoolManager.attach(deployedAddresses.LiquidityPoolManager);

        // 打印合约地址以验证
        console.log("RewardToken Address:", await rewardToken.getAddress());
        console.log("LiquidityPoolManager Address:", await liquidityPoolManager.getAddress());
    });

    it("Should return the correct reward rate", async function () {
        // 验证 rewardRate
        const rewardRate = await liquidityPoolManager.rewardRate();
        console.log("Reward Rate:", rewardRate.toString()); // 打印返回值
        expect(rewardRate).to.equal(1); // 验证是否为 1
    });
    
    it("Should deposit tokens successfully", async function () {
        const deployerAddress = await deployer.getAddress();
    
        // 确保奖励 Token 已授权
        await rewardToken.connect(deployer).approve(await liquidityPoolManager.getAddress(), 100);
    
        // 存款
        const tx = await liquidityPoolManager.connect(deployer).deposit(100);
        await tx.wait();
    
        // 验证余额
        const userBalance = await liquidityPoolManager.userBalances(deployerAddress);
        console.log("User Balance After Deposit:", userBalance.toString());
        expect(userBalance).to.equal(100);
    });

    it("Should withdraw tokens successfully", async function () {
        const deployerAddress = await deployer.getAddress();

        // 调用提款函数
        const tx = await liquidityPoolManager.connect(deployer).withdraw(50);
        await tx.wait();

        // 验证余额减少
        const userBalance = await liquidityPoolManager.userBalances(deployerAddress);
        console.log("User Balance After Withdraw:", userBalance.toString());
        expect(userBalance).to.equal(50);
    });
});
