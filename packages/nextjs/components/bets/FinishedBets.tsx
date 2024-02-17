import React, { useEffect, useState } from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { formatEther } from "viem";

const FinishedBets = () => {
  const [finishedBets, setFinishedBets] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { data: betFinishedHistory } = useScaffoldEventHistory({
    contractName: "DuelContract",
    eventName: "BetFinished",
    fromBlock: BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || "0"),
    watch: true,
  });

  useEffect(() => {
    if (betFinishedHistory) {
      const updatedFinishedBets = betFinishedHistory.map(singleEventBetFinished => {
        const betId = BigInt(singleEventBetFinished.args[0]) || BigInt(0);
        const winner = singleEventBetFinished.args[1];
        const loser = singleEventBetFinished.args[2];
        const amount = BigInt(singleEventBetFinished.args[3]) || BigInt(0);
        return { betId, winner, loser, amount };
      });

      setFinishedBets(updatedFinishedBets);
      setIsLoadingHistory(false);
    }
  }, [betFinishedHistory]);

  return (
    <div className="px-8 py-12">
      {isLoadingHistory ? (
        <strong> Loading... </strong>
      ) : (
        <div>
          <span className="text-center mb-4 block text-2xl font-bold">Finished Bets</span>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Bet ID</th>
                  <th>Winner Address</th>
                  <th>Loser Address</th>
                  <th>Bet Amount</th>
                </tr>
              </thead>
              <tbody>
                {finishedBets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No events finished yet!
                    </td>
                  </tr>
                ) : (
                  finishedBets.map(({ betId, winner, loser, amount }) => (
                    <tr key={parseInt(betId.toString())}>
                      <td>{parseInt(betId.toString())}</td>
                      <td><Address address={winner} /></td>
                      <td><Address address={loser} /></td>
                      <td>{parseFloat(formatEther(amount)).toFixed(4)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishedBets;
