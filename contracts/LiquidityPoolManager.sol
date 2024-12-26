// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPoolManager is Ownable {
    IERC20 public lpToken; //LP token
    IERC20 public rewardToken; //reward token

    uint256 public rewardRate = 1; //reward rate per second 每秒奖励比例
    mapping(address => uint256) public userBalances; //User LP deposit balance 用户 LP 存款余额
    mapping(address => uint256) public lastUpdateTime; //Last time refresh reward time 上次奖励更新时间
    mapping(address => uint256) public rewards; //Rewards that users have earned but not withdrawn 用户未领取的奖励

    constructor(address _lpToken, address _rewardToken) Ownable(msg.sender) {
        lpToken = IERC20(_lpToken);
        rewardToken = IERC20(_rewardToken);
    }

    // 存款功能
    function deposit(uint256 amount) public {
        require(amount > 0,"Amount must be greater than 0");
        lpToken.transferFrom(msg.sender, address(this), amount);
        _updateReward(msg.sender);
        userBalances[msg.sender] += amount;
        lastUpdateTime[msg.sender] = block.timestamp;
    }

    // 取款功能
    function withdraw(uint256 amount) public {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        _updateReward(msg.sender);
        userBalances[msg.sender] -= amount;
        lpToken.transfer(msg.sender, amount);
    }

    //索取奖励
    function claimReward() public {
        _updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        rewards[msg.sender] = 0; //重置奖励
        rewardToken.transfer(msg.sender, reward); //转移奖励到用户
    }

    //紧急提款
    function emergencyWithdraw() public {
        uint256 balance = userBalances[msg.sender]; //获取用户余额
        require(balance > 0, "No balance to withdraw");
        userBalances[msg.sender] = 0; //重置用户余额
        rewards[msg.sender] = 0; //重置奖励
        lpToken.transfer(msg.sender, balance); //转移余额到用户
    }

    //查询合约中的LP总存款
    function getTotalDeposit() public view returns (uint256) {
        return lpToken.balanceOf(address(this)); //返回合约中的LP总存款
    }

    //manager 更新奖励率
    function setRewardRate(uint256 _rewardRate)public onlyOwner{
        require(_rewardRate > 0,"Reward rate must be greater than 0");
        rewardRate = _rewardRate; //更新奖励率
    }

    //更新用户奖励
    function _updateReward(address user) internal {
        if(userBalances[user] > 0){
            rewards[user] += _calculateReward(user); //更新用户奖励
        }
        lastUpdateTime[user] = block.timestamp; //更新上次奖励时间
    }

    //计算用户应得的奖励
    function _calculateReward(address user) internal view returns (uint256) {
        uint256 timeDiff = block.timestamp - lastUpdateTime[user]; //计算时间差
        return userBalances[user] * rewardRate * timeDiff / 1e18; //计算奖励formula
    }
}