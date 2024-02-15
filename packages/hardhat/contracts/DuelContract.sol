//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

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
	uint256 public betIdCounter = 0;
    	uint256 public immutable timeOutBlockNumber = 0; // TODO 63360;	// (4 * 60 * 24) Bet cannot be accepted in the last day 

	enum BetState {
		PENDING,
		INPROGRESS,
		PLAYER1WON,
		PLAYER2WON
	}
	
	struct Bet {
		address player1;
		address player2;
		BetState state;
		uint256 targetPrice;
		bool isHigherChosen;
		uint256 lastBlockNumber;
		uint256 amount;
	}
	
	mapping(uint256 => Bet) public bets;

	/* EVENTS */
	event BetCreated(
		uint256 indexed betId,
		address indexed player1,
		uint256 indexed amount,
		uint256 targetPrice,
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
	
	/* EXTERNAL FUNCTIONS */
	function createBet(uint256 _targetPrice, bool _isHigherChosen, uint256 _lastBlockNumber) external payable {
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
			state: BetState.PENDING,
			amount: msg.value,
            lastBlockNumber : _lastBlockNumber
		});

		// This event can be used by the frontend to know that something happened and react to it
		emit BetCreated(betIdCounter, msg.sender, msg.value, _targetPrice, _isHigherChosen, _lastBlockNumber);
	}

	function acceptBet(uint256 _betId) external payable {
		Bet memory bet = bets[_betId];
		require(bet.player1 != msg.sender, "You can't challenge yourself");
		require(bet.state == BetState.PENDING, "Bet must be PENDING to be accepted");
		require(bet.amount <= msg.value, "You haven't sent required amount of ETH to accept");
		require(bet.lastBlockNumber > block.number + timeOutBlockNumber, "Bets can only be accepted 1 day before the last block number");

		// Assign the second player and set state to INPROGRESS and emit an event
		bets[_betId].player2 = msg.sender;
		bets[_betId].state = BetState.INPROGRESS;
		emit BetAccepted(_betId, bet.player2);
	}

	function deleteBet(uint256 _betId) external {
		Bet memory bet = bets[_betId];
		require(bet.player1 == msg.sender, "You must be player 1 to delete the bet request");
		require(bet.state == BetState.PENDING, "Bet must be PENDING to be deleted");

		bets[_betId].state = BetState.PLAYER1WON;
		
		// Transfer the bet amount to the player
		payable(msg.sender).transfer(bet.amount);
		emit BetDeleted(_betId);
	}
	
	function finishBet(uint256 _betId) external {
		Bet storage bet = bets[_betId];
		require(bet.state == BetState.INPROGRESS, "Bet is not in INPROGRESS state");
		// TODO: Uncomment require(bet.lastBlockNumber < block.number, "Bet is not completed yet");

		// Determine the result based on the winner and update game state accordingly
		// use the follow'ng to get the ETH price: https://solidity-by-example.org/defi/chainlink-price-oracle/
		bets[_betId].state = BetState.PLAYER2WON;			// TODO
		payable(bet.player2).transfer(2 * bet.amount);	// 0.1 of the bet is taken by the contract

		// Emit GameFinished event
    	emit BetFinished(_betId, bet.player2, bet.player1, bet.amount);		// TODO -> winner & loser addressleri duzgun degerlendir burada
	}


	function getBetState(uint256 _betId) public view returns (BetState)  {
		return bets[_betId].state;
	}
}
