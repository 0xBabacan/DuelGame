import React from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
//import { useAccount } from "wagmi";
import { formatEther } from "viem";
//import { useState } from "react";

const BetList = () => {
/*
  const { address: connectedAddress } = useAccount();
  const [betId, setBetId] = useState<bigint>("");

  const { data: betState } = useScaffoldContractRead({
    contractName: "DuelContract",
    functionName: "getBetState",
    args: [BigInt(betId)],
  });

  const { writeAsync: acceptBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "acceptBet",
    args: [BigInt(bet.betId)],
    value: BigInt(bet.betAmount),
  });

  const { writeAsync: finishBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "finishBet",
    args: [BigInt(bet.betId)],
  });
*/
  const { data: betCreatedHistory, isLoading: isLoadingBetCreatedHistory } = useScaffoldEventHistory({
    contractName: "DuelContract",
    eventName: "BetCreated",
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

  const betList = betCreatedHistory?.map(singleEventBetCreated => {
    const isBetAccepted: boolean = betAcceptedHistory?.some(singleEventBetAccepted => singleEventBetAccepted.args[0] === singleEventBetCreated.args[0]) || false;
    const isBetFinished: boolean = betFinishedHistory?.some(singleEventBetFinished => singleEventBetFinished.args[0] === singleEventBetCreated.args[0]) || false;
    return { singleEventBetCreated, isBetAccepted, isBetFinished };
  });

  return (
    <div>
      {isLoadingBetCreatedHistory ? (
          <strong> Loading... </strong>
      ) : (
        <div className="rounded-3xl" style={{ flex: 1, backgroundColor: 'darkblue' }}>
          <div className="text-center mb-4">
            <span className="block text-2xl font-bold">Active Bets</span>
          </div>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Bet ID</th>
                  <th>Player-1</th>
                  <th>Bet Amount</th>
                  <th>Target Price</th>
                  <th>isHigher</th>
                  <th>Last Block No</th>
                  <th>isAccepted</th>
                  <th>isFinished</th>
                </tr>
              </thead>
              <tbody>
                {!betCreatedHistory || betCreatedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No events found
                    </td>
                  </tr>
                ) : (
                  betList?.map(({ singleEventBetCreated, isBetAccepted, isBetFinished }) => {
                    return (
                      <tr key={parseInt(singleEventBetCreated.args[0].toString())}>
                        <td>{parseInt(singleEventBetCreated.args[0].toString())}</td>
                        <td><Address address={singleEventBetCreated.args[1]} /></td>
                        <td>{parseFloat(formatEther(singleEventBetCreated.args[2])).toFixed(4)}</td>
                        <td>{parseInt(singleEventBetCreated.args[3].toString())}</td>
                        <td>{singleEventBetCreated.args[4].toString()}</td>
                        <td>{parseInt(singleEventBetCreated.args[5].toString())}</td>
                        <td>{isBetAccepted.toString()}</td>
                        <td>{isBetFinished.toString()}</td>
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

export default BetList;
