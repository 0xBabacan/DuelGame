import React from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { formatEther } from "viem";

const FinishedBets = () => {

  const { data: betFinishedHistory, isLoading: isLoadingBetFinishedHistory } = useScaffoldEventHistory({
    contractName: "DuelContract",
    eventName: "BetFinished",
    fromBlock: BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || "0"),
    watch: true,
  });

  const finishedBets = betFinishedHistory?.map(singleEventBetFinished => {
      const betId: bigint = singleEventBetFinished.args[0] || BigInt(0);
      const winner: string = singleEventBetFinished.args[1];
      const loser: string = singleEventBetFinished.args[2];
      const amount: bigint = singleEventBetFinished.args[3] || BigInt(0);
    return { betId, winner, loser, amount };
  });

  return (
    <div>
      {isLoadingBetFinishedHistory ? (
          <strong> Loading... </strong>
      ) : (
        <div className="rounded-3xl" style={{ flex: 1, backgroundColor: 'coral' }}>
          <div className="text-center mb-4">
            <span className="block text-2xl font-bold">Finished Bets</span>
          </div>
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
                {!betFinishedHistory || betFinishedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No events finished yet!
                    </td>
                  </tr>
                ) : (
                  finishedBets?.map(({ betId, winner, loser, amount }) => {
                    return (
                      <tr key={parseInt(betId.toString())}>
                        <td>{parseInt(betId.toString())}</td>
                        <td><Address address={winner} /></td>
                        <td><Address address={loser} /></td>
                        <td>{parseFloat(formatEther(amount)).toFixed(4)}</td>
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

export default FinishedBets;
