// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract SIPManager is Ownable {
    struct SIPPlan {
        uint256 amount;
        uint256 frequency; // in seconds
        uint256 lastInvestmentTime;
        address[] tokens;
        uint256[] allocations; // in percentage (sum should be 100)
        bool active;
    }

    mapping(address => SIPPlan) public userPlans;
    mapping(address => bool) public supportedTokens;

    event PlanCreated(address indexed user, uint256 amount, uint256 frequency);
    event InvestmentExecuted(address indexed user, uint256 amount);
    event PlanDeactivated(address indexed user);

    constructor() Ownable(msg.sender) {}

    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    function createPlan(
        uint256 _amount,
        uint256 _frequency,
        address[] calldata _tokens,
        uint256[] calldata _allocations
    ) external {
        require(_tokens.length == _allocations.length, 'Invalid allocations');
        require(_tokens.length > 0, 'Empty token list');
        
        uint256 totalAllocation = 0;
        for(uint i = 0; i < _tokens.length; i++) {
            require(supportedTokens[_tokens[i]], 'Unsupported token');
            totalAllocation += _allocations[i];
        }
        require(totalAllocation == 100, 'Invalid allocation sum');

        userPlans[msg.sender] = SIPPlan({
            amount: _amount,
            frequency: _frequency,
            lastInvestmentTime: block.timestamp,
            tokens: _tokens,
            allocations: _allocations,
            active: true
        });

        emit PlanCreated(msg.sender, _amount, _frequency);
    }

    function executeInvestment() external {
        SIPPlan storage plan = userPlans[msg.sender];
        require(plan.active, 'No active plan');
        require(block.timestamp >= plan.lastInvestmentTime + plan.frequency, 'Too early');

        uint256 totalAmount = plan.amount;
        require(IERC20(address(0)).balanceOf(msg.sender) >= totalAmount, 'Insufficient balance');

        for(uint i = 0; i < plan.tokens.length; i++) {
            uint256 tokenAmount = (totalAmount * plan.allocations[i]) / 100;
            IERC20(plan.tokens[i]).transferFrom(msg.sender, address(this), tokenAmount);
        }

        plan.lastInvestmentTime = block.timestamp;
        emit InvestmentExecuted(msg.sender, totalAmount);
    }

    function deactivatePlan() external {
        require(userPlans[msg.sender].active, 'No active plan');
        userPlans[msg.sender].active = false;
        emit PlanDeactivated(msg.sender);
    }
}