//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Duelgame
 * @author 0xBabacan
 * @notice A betting duello game contract.
 * @dev Currently it will be used for challenging other accounts to bet on ETH price
 * Sports, finance and other topic can be implemented for betting in future     
 */

contract DuelContract is Ownable {
	address public owner = 0x5D70E3b540f58beCd10B74f6c0958b31e3190DA7;	// Owner is babacan.eth
	uint256 public betIdCounter = 0;
    uint256 public immutable timeoutValueForOneHour = 300; // TODO 3600;	// (60 * 60) Bet cannot be accepted in the last hour 

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
		int256 targetPrice;
		bool isHigherChosen;
		uint256 targetTimestamp;
		uint256 amount;
	}
	
	mapping(uint256 => Bet) public bets;

	event BetCreated(
		uint256 indexed betId,
		address indexed player1,
		uint256 indexed amount,
		int256 targetPrice,
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

	AggregatorV3Interface internal priceFeed;

	constructor() {
		yourToken = YourToken(tokenAddress);
        priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);	// ETH / USD
    }

	modifier onlyBoss() {
		require(msg.sender == owner(), "Sorry, you're not the boss!");
		_;
	}

	function createBet(int256 _targetPrice, bool _isHigherChosen, uint256 _targetTimestamp) external payable {
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
		require(bet.targetTimestamp > block.timestamp + timeoutValueForOneHour, "Bets can lastly be accepted 1 hour before the bet finishes");

		// Assign the second player and set state to ACCEPTED and emit an event
		bets[_betId].player2 = msg.sender;
		bets[_betId].state = BetState.ACCEPTED;
		emit BetAccepted(_betId, bet.player2);
	}

	function deleteBet(uint256 _betId) external {
		Bet memory bet = bets[_betId];
		require(bet.player1 == msg.sender, "You must be player 1 to delete the bet request");
		require(bet.state == BetState.WAITING, "Bet must be WAITING to be deleted");

		bets[_betId].state = BetState.PLAYER1WON;
		
		// Transfer the bet amount to the player
		payable(msg.sender).transfer(bet.amount);
		emit BetDeleted(_betId);
	}

	function finishBet(uint256 _betId, int256 _priceAtBetFinished) external onlyBoss {
		Bet storage bet = bets[_betId];
		console.log("-> bet.targetTimestamp", bet.targetTimestamp);		//TODO: DELETE
		console.log("-> block.timestamp", block.timestamp);				//TODO: DELETE
		require(bet.state == BetState.ACCEPTED, "Bet is not in ACCEPTED state");
		require(bet.targetTimestamp < block.timestamp, "Bet is not completed yet");

		// Determine the result based on the winner and update game state accordingly
		if ((_priceAtBetFinished > bet.targetPrice && bet.isHigherChosen == true) || (_priceAtBetFinished < bet.targetPrice && bet.isHigherChosen == false)) {
			bets[_betId].state = BetState.PLAYER1WON;
			payable(bet.player1).transfer(19 * bet.amount / 10);
			emit BetFinished(_betId, bet.player1, bet.player2, bet.amount);
		} else {
			bets[_betId].state = BetState.PLAYER2WON;
			payable(bet.player1).transfer(19 * bet.amount / 10);
			emit BetFinished(_betId, bet.player2, bet.player1, bet.amount);
		}
	}
	
	function getLatestPrice() public view returns (int) {
	    (
	        uint80 roundID, 
	        int price,
	        uint startedAt,
	        uint timeStamp,
	        uint80 answeredInRound
	    ) = priceFeed.latestRoundData();
	    return (price / 1e8);
	}

	function withdraw() external onlyBoss {
		uint256 balance = address(this).balance;
		require(balance > 0, "Contract has no balance to withdraw");
		payable(owner).transfer(balance);
	}

    receive() external payable {}
}
