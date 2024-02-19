//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Duel
 * @author 0xBabacan
 * @notice A betting duello game contract.
 * @dev Currently it will be used for challenging other accounts to bet on ETH price
 * Sports, finance and other topic can be implemented for betting in future     
 */

contract DuelContract is Ownable {
	uint256 public betIdCounter = 0;
    uint256 public immutable timeoutValueForOneMinute = 60; // Bet cannot be accepted in the last minute 

	enum BetState {
		WAITING,
		ACCEPTED,
		PLAYER1WON,
		PLAYER2WON
	}
	
	struct Bet {
		address player1;
		address player2;
		BetState state;
		uint256 targetPrice;
		bool isHigherChosen;
		uint256 targetTimestamp;
		uint256 amount;
	}
	
	mapping(uint256 => Bet) public bets;

	event BetCreated(
		uint256 indexed betId,
		address indexed player1,
		uint256 indexed amount,
		uint256 targetPrice,
		bool isHigherChosen,
		uint256 targetTimestamp
	);
	event BetAccepted(
		uint256 indexed betId,
		address indexed player2
	);
	event BetDeleted(
		uint256 indexed betId
	);
	event BetFinished(
		uint256 indexed betId,
		address indexed winner,
		address indexed loser,
		uint256 amount
	);

	modifier onlyBoss() {
		require(msg.sender == owner(), "Sorry, you're not the boss!");
		_;
	}

	function createBet(uint256 _targetPrice, bool _isHigherChosen, uint256 _targetTimestamp) external payable {
		require(_targetPrice > 0, "You cannot create bet with target price being 0");
		require(_targetTimestamp > block.timestamp, "Last block number is smaller than the current block number!");

		// Increase betIdCounter by one, as a new bet is created
		betIdCounter++;
		// Fill the information as a blank bet with the data for the Bet struct
		bets[betIdCounter] = Bet({
			player1: msg.sender,
			player2: address(0),
			targetPrice: _targetPrice,
			isHigherChosen: _isHigherChosen,
			state: BetState.WAITING,
			amount: msg.value,
            targetTimestamp : _targetTimestamp
		});
		emit BetCreated(betIdCounter, msg.sender, msg.value, _targetPrice, _isHigherChosen, _targetTimestamp);
	}

	function acceptBet(uint256 _betId) external payable {
		Bet memory bet = bets[_betId];
		require(bet.player1 != msg.sender, "You can't challenge yourself");
		require(bet.state == BetState.WAITING, "Bet must be WAITING to be accepted");
		require(bet.amount <= msg.value, "You haven't sent required amount of ETH to accept");
		require(bet.targetTimestamp > block.timestamp + timeoutValueForOneMinute, "Bets can lastly be accepted 1 minute before the bet finishes");

		// Assign the second player and set state to ACCEPTED
		bets[_betId].player2 = msg.sender;
		bets[_betId].state = BetState.ACCEPTED;
		emit BetAccepted(_betId, bet.player2);
	}

	function deleteBet(uint256 _betId) external {
		Bet memory bet = bets[_betId];
		require(bet.player1 == msg.sender, "You must be player 1 to delete the bet request");
		require(bet.state == BetState.WAITING, "Bet must be WAITING to be deleted");

		bets[_betId].state = BetState.PLAYER1WON;
		
		// Transfer the bet amount to the bet creator
		payable(msg.sender).transfer(bet.amount);
		emit BetDeleted(_betId);
	}

	function finishBet(uint256 _betId, uint256 _priceAtBetFinished) external onlyBoss {
		Bet storage bet = bets[_betId];
		require(bet.state == BetState.ACCEPTED, "Bet is not in ACCEPTED state");
		require(bet.targetTimestamp < block.timestamp, "Bet is not completed yet");

		// Determine the winner based on the price, update bet state accordingly and transfer the bet amount to the winner
		if ((_priceAtBetFinished > bet.targetPrice && bet.isHigherChosen == true) || (_priceAtBetFinished < bet.targetPrice && bet.isHigherChosen == false)) {
			bets[_betId].state = BetState.PLAYER1WON;
			payable(bet.player1).transfer(19 * bet.amount / 10);	// 10 percent of the total bet amount will reside in the contract
			emit BetFinished(_betId, bet.player1, bet.player2, bet.amount);
		} else {
			bets[_betId].state = BetState.PLAYER2WON;
			payable(bet.player1).transfer(19 * bet.amount / 10);	// 10 percent of the total bet amount will reside in the contract
			emit BetFinished(_betId, bet.player2, bet.player1, bet.amount);
		}
	}

	function withdraw() external onlyBoss {
		uint256 balance = address(this).balance;
		require(balance > 0, "Contract has no balance to withdraw");
		payable(owner()).transfer(balance);
	}

    receive() external payable {}
}
