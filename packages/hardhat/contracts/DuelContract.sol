//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title Duelgame
 * @author 0xBabacan
 * @notice A betting duello game contract.
 * @dev Currently it will be used for challenging other accounts to bet on ETH price
 * Sports, finance and other topic can be implemented for betting in future     
 */
 /*
                 ) : (betState != 2 && betState != 3) ? (
                  betCreatedHistory?.map((event, index) => {
                    return (
                      <tr key={index}>
                        setBetId(parseInt(event.args.betId.toString()));
                        <td>{parseInt(event.args.betId.toString())}</td>
                        <td className="text-center">
                          <Address address={event.args.player1} />
                        </td>
                        <td>{parseInt(event.args.targetPrice.toString())}</td>
                        <td>{event.args.isHigherChosen.toString()}</td>
                        <td>{parseInt(event.args.lastBlockNumber.toString())}</td>
                        <td>{parseFloat(formatEther(event.args.amount)).toFixed(4)}</td>
                      </tr>
                    );
                  })
                ) : (
                  Check finished bets
                )}
*/
contract DuelContract {
	address public owner = 0x5D70E3b540f58beCd10B74f6c0958b31e3190DA7;	// babacan.eth
	uint256 public betIdCounter = 0;
    uint256 public immutable timeOutBlockNumber = 4; // TODO 240;	// (4 * 60) Bet cannot be accepted in the last hour 

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
		uint256 lastBlockNumber;
		uint256 amount;
	}
	
	mapping(uint256 => Bet) public bets;

	event BetCreated(
		uint256 indexed betId,
		address indexed player1,
		uint256 indexed amount,
		int256 targetPrice,
		bool isHigherChosen,
		uint256 lastBlockNumber
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
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);	// ETH / USD
    }

	function createBet(int256 _targetPrice, bool _isHigherChosen, uint256 _lastBlockNumber) external payable {
		require(_targetPrice > 0, "You cannot create bet with target price being 0");
		require(_lastBlockNumber > block.number, "Last block number is smaller than the current block number!");

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
            lastBlockNumber : _lastBlockNumber
		});
		emit BetCreated(betIdCounter, msg.sender, msg.value, _targetPrice, _isHigherChosen, _lastBlockNumber);
	}

	function acceptBet(uint256 _betId) external payable {
		Bet memory bet = bets[_betId];
		require(bet.player1 != msg.sender, "You can't challenge yourself");
		require(bet.state == BetState.WAITING, "Bet must be WAITING to be accepted");
		require(bet.amount <= msg.value, "You haven't sent required amount of ETH to accept");
		require(bet.lastBlockNumber > block.number + timeOutBlockNumber, "Bets can be lastly accepted 1 hour before the last block number");

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

	function finishBet(uint256 _betId) external {
		Bet storage bet = bets[_betId];
		require(bet.state == BetState.ACCEPTED, "Bet is not in ACCEPTED state");
		require(bet.lastBlockNumber < block.number, "Bet is not completed yet");

		// Determine the result based on the winner and update game state accordingly
		int price = getLatestPrice();
		if ((price > bet.targetPrice && bet.isHigherChosen == true) || (price < bet.targetPrice && bet.isHigherChosen == false)) {
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
	    (, int price, , , ) = priceFeed.latestRoundData();
	    //return (price / 1e8);
	    return price;
	}

	function withdraw() external {
		require(msg.sender == owner, "You are not babacan.eth");
		uint256 balance = address(this).balance;
		require(balance > 0, "Contract has no balance to withdraw");
		payable(owner).transfer(balance);
	}

    receive() external payable {}
}
