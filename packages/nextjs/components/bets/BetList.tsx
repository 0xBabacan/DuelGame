import React from "react";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useState, useEffect } from "react";

const BetList = () => {

  const { address: connectedAddress } = useAccount();
  const [betId, setBetId] = useState<bigint>("");
  const [betAmount, setBetAmount] = useState<bigint>("");
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
    args: [BigInt(betId)],
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

  const handleDelete = (singleEventBetCreated) => {
    deleteBet({ args: [BigInt(singleEventBetCreated.args[0])] });
  };

  const handleAccept = (singleEventBetCreated) => {
    acceptBet({ args: [BigInt(singleEventBetCreated.args[0])], value: BigInt(singleEventBetCreated.args[2].toString()) });
  };

  const handleFinish = (singleEventBetCreated) => {
    finishBet({ args: [BigInt(singleEventBetCreated.args[0])] })
  };

  return (
    <div className="px-8 py-12">
      {isLoadingHistory ? (
          <strong> Loading... </strong>
      ) : (
        <div>
          <span className="text-center mb-4 block text-2xl font-bold">Active Bets</span>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-primary">
                  <th>Bet ID</th>
                  <th>Created by</th>
                  <th>Bet Amount</th>
                  <th>Target Price</th>
                  <th>isHigher</th>
                  <th>Ends at(block no)</th>
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
                        <td>{parseInt(singleEventBetCreated.args[3].toString())}</td>
                        <td>{singleEventBetCreated.args[4].toString()}</td>
                        <td>{parseInt(singleEventBetCreated.args[5].toString())}</td>
                        <td>
                          {isBetFinished ? (
                            <span>Finished</span>
                          ) : isBetAccepted ? (
                            <>
                              <span>Accepted</span>
                              <button className="btn btn-secondary h-[1.5rem] min-h-[1.5rem]" colorScheme={"yellow"} onClick={() => handleFinish(singleEventBetCreated)}>
                                Finish bet!
                              </button>
                            </>
                          ) : isBetDeleted ? (
                            <span>Deleted</span>
                          ) : (
                            <>
                              <span>Waiting   </span>
                              {singleEventBetCreated.args[1] === connectedAddress ? (
                                <button className="btn btn-secondary h-[1.5rem] min-h-[1.5rem]" colorScheme={"red"} onClick={() => handleDelete(singleEventBetCreated)}>
                                  Delete bet!
                                </button>
                              ) : (
                                <button className="btn btn-secondary h-[1.5rem] min-h-[1.5rem]" colorScheme={"green"} onClick={() => handleAccept(singleEventBetCreated)}>
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

export default BetList;
