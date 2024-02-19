import React, { useEffect, useState } from "react";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { Web3 } from "web3"
import { Contract } from '@wagmi/core'

const BetHistory = () => {

  const { address: connectedAddress } = useAccount();
  const [betId, setBetId] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [priceAtBetFinished, setPriceAtBetFinished] = useState("");
  const [betList, setBetList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { writeAsync: deleteBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "deleteBet",
    args: [BigInt(betId)],
  });

  const { writeAsync: acceptBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "acceptBet",
    args: [BigInt(betId)],
    value: BigInt(betAmount),
  });

  const { writeAsync: finishBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "finishBet",
    args: [BigInt(betId), parseEther(priceAtBetFinished)],
  });

  const { data: betCreatedHistory } = useScaffoldEventHistory({
    contractName: "DuelContract",
    eventName: "BetCreated",
    fromBlock: BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || "0"),
    watch: true,
  });

  const { data: betDeletedHistory } = useScaffoldEventHistory({
    contractName: "DuelContract",
    eventName: "BetDeleted",
    fromBlock: BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || "0"),
    watch: true,
  });

  const { data: betAcceptedHistory } = useScaffoldEventHistory({
    contractName: "DuelContract",
    eventName: "BetAccepted",
    fromBlock: BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || "0"),
    watch: true,
  });

  const { data: betFinishedHistory } = useScaffoldEventHistory({
    contractName: "DuelContract",
    eventName: "BetFinished",
    fromBlock: BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || "0"),
    watch: true,
  });

  useEffect(() => {
    if (betCreatedHistory) {
      const updatedBetList = betCreatedHistory.map(singleEventBetCreated => {
        const isBetDeleted: boolean = betDeletedHistory?.some(singleEventBetDeleted => singleEventBetDeleted.args[0] === singleEventBetCreated.args[0]) || false;
        const isBetAccepted: boolean = betAcceptedHistory?.some(singleEventBetAccepted => singleEventBetAccepted.args[0] === singleEventBetCreated.args[0]) || false;
        const isBetFinished: boolean = betFinishedHistory?.some(singleEventBetFinished => singleEventBetFinished.args[0] === singleEventBetCreated.args[0]) || false;
        return { singleEventBetCreated, isBetDeleted, isBetAccepted, isBetFinished };
      });

      setBetList(updatedBetList);
      setIsLoadingHistory(false);
    }
  }, [betCreatedHistory, betDeletedHistory, betAcceptedHistory, betFinishedHistory]);

  /*
      Obtaining the price data from chainlink is moved from smart contract to here so that the gas fee is lowered
  */ 
  const provider = "https://eth-sepolia.g.alchemy.com/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF"
  const web3Provider = new Web3.providers.HttpProvider(provider);
  const web3 = new Web3(web3Provider);
  const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
  const addr = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

  const handleFinish = async (singleEventBetCreated) => {
    const targetTimestamp = BigInt(singleEventBetCreated.args[5].toString());

    try {
      const latestRoundData = await priceFeed.methods.latestRoundData().call();

      if(targetTimestamp < latestRoundData.updatedAt) {
        const phaseId = Number(BigInt(latestRoundData.roundId) >> 64n);
        const aggregatorRoundId = BigInt(latestRoundData.roundId) & BigInt("0xFFFFFFFFFFFFFFFF");
        const firstRoundId = BigInt(latestRoundData.roundId) - aggregatorRoundId + 1n;
        let isRoundIdFound = false;
        let roundIdAtTarget;

        for (let i = BigInt(latestRoundData.roundId); i > firstRoundId; i--) {
          const historicalRoundData = await priceFeed.methods.getRoundData(i).call();
          if (targetTimestamp > historicalRoundData.updatedAt) {
            roundIdAtTarget = historicalRoundData.roundId;
            isRoundIdFound = true;
            break;
          }
        }

        if(isRoundIdFound) {
          const priceDataAtTarget = await priceFeed.methods.getRoundData(roundIdAtTarget).call();
          const priceAtTargetAsFloat =  (parseFloat(priceDataAtTarget.answer.toString()) / 10**8);
          const priceAtTargetInWei = parseEther(priceAtTargetAsFloat.toString());
          finishBet({ args: [BigInt(singleEventBetCreated.args[0]), priceAtTargetInWei] });
        }
        else
          console.error("Target Round ID couldnt be found with the latest round id:", latestRoundData.roundId);
      } else {
        console.error("Bet is not completed yet!");
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleDelete = (singleEventBetCreated) => {
    deleteBet({ args: [BigInt(singleEventBetCreated.args[0])] });
  };

  const handleAccept = (singleEventBetCreated) => {
    setBetId(singleEventBetCreated.args[0].toString());
    setBetAmount(singleEventBetCreated.args[2].toString());
    acceptBet({ args: [BigInt(singleEventBetCreated.args[0])], value: BigInt(singleEventBetCreated.args[2].toString()) });
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date).toString();
  };

  return (
    <div className="px-8 py-12 text-gray-700">
      {isLoadingHistory ? (
          <strong> Loading... </strong>
      ) : (
        <div>
          <span className="text-center mb-4 block text-2xl font-bold">Bet History</span>
          <div className="overflow-x-auto rounded-xl" style={{ flex: 1, fontSize: '1.0em' }}>
            <table className="table w-full">
              <thead>
                <tr className="bg-primary text-center" style={{ fontSize: '1.2em' }}>
                  <th>Bet ID</th>
                  <th>Created by</th>
                  <th>Bet Amount</th>
                  <th>Target Price</th>
                  <th>isHigher</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {betList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No events found
                    </td>
                  </tr>
                ) : (
                  betList?.map(({ singleEventBetCreated, isBetDeleted, isBetAccepted, isBetFinished }) => {
                    return (
                      <tr key={parseInt(singleEventBetCreated.args[0].toString())}>
                        <td>{parseInt(singleEventBetCreated.args[0].toString())}</td>
                        <td><Address address={singleEventBetCreated.args[1]} /></td>
                        <td>{parseFloat(formatEther(singleEventBetCreated.args[2])).toFixed(4)}</td>
                        <td>{singleEventBetCreated.args[3] !== "" ? (parseFloat(singleEventBetCreated.args[3].toString()) / 10**18).toFixed(4) : 0}</td>
                        <td>{singleEventBetCreated.args[4].toString()}</td>
                        <td>{formatTimestamp(parseInt(singleEventBetCreated.args[5].toString()))}</td>
                        <td>
                          {isBetFinished ? (
                            <span>Finished</span>
                          ) : isBetAccepted ? (
                            <>
                              <span style={{ marginRight: '1rem' }}>Accepted</span>
                              <button className="btn btn-secondary h-[1.8rem] min-h-[1.5rem]" onClick={() => handleFinish(singleEventBetCreated)}>
                                Finish bet!
                              </button>
                            </>
                          ) : isBetDeleted ? (
                            <span>Deleted</span>
                          ) : (
                            <>
                              <span style={{ marginRight: '1rem' }}>Waiting   </span>
                              {singleEventBetCreated.args[1] === connectedAddress ? (
                                <button className="btn btn-secondary h-[1.8rem] min-h-[1.5rem]" onClick={() => handleDelete(singleEventBetCreated)}>
                                  Delete bet!
                                </button>
                              ) : (
                                <button className="btn btn-secondary h-[1.8rem] min-h-[1.5rem]" onClick={() => handleAccept(singleEventBetCreated)}>
                                  Accept bet!
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetHistory;
