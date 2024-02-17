import React, { useEffect, useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { parseEther  } from "viem";

const CreateBet = () => {
  
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [isHigherChosen, setIsHigherChosen] = useState(true);
  const [lastBlockNumber, setLastBlockNumber] = useState<string>("");
  const [betAmount, setBetAmount]  = useState<string>("");

  const { writeAsync: createBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "createBet",
    value: parseEther(betAmount),
    args: [BigInt(targetPrice), isHigherChosen, BigInt(lastBlockNumber)],
  });

  useEffect(() => {
    const fetchBlockNumber = async () => {
      try {
        const response = await fetch('http://localhost:8545', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        });
        const data = await response.json();
        setCurrentBlockNumber(parseInt(data.result, 16));
      } catch (error) {
        console.error('Error fetching block number:', error);
      }
    };

    // Fetch block number initially
    fetchBlockNumber();

    // Fetch block number every 15 seconds
    const intervalId = setInterval(fetchBlockNumber, 15000);

    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run effect only once

  return (
    <div className="px-8 py-12 space-y-3">
      <div className="text-center mb-4">
        <span className="block text-2xl font-bold">Create a bet!</span>
      </div>
      <div className="flex flex-row items-center">
        <div className="w-full text-l">Target ETH price:</div>
        <input
          id="targetPrice"
          type="text"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          style={{ width: "80px", color: "#EBF5FF", background: "#002060", border: "1px solid #EBF5FF", borderRadius: "8px", ring: "1px solid indigo", ringColor: "indigo", paddingLeft: "6px", outline: "none"}}
        />
      </div>
      <div className="flex flex-row">
        <div className="w-full text-l">Last block number for deadline:</div>
        <input
          type="text"
          value={lastBlockNumber}
          onChange={(e) => setLastBlockNumber(e.target.value)}
          style={{ width: "80px", color: "#EBF5FF", background: "#002060", border: "1px solid #EBF5FF", borderRadius: "8px", ring: "1px solid indigo", ringColor: "indigo", paddingLeft: "6px", outline: "none"}}
        />
      </div>
      <div className="flex flex-row">
        <div className="w-full text-l">Bet amount:</div>
        <input
          type="text"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          style={{ width: "80px", color: "#EBF5FF", background: "#002060", border: "1px solid #EBF5FF", borderRadius: "8px", ring: "1px solid indigo", ringColor: "indigo", paddingLeft: "6px", outline: "none"}}
        />
      </div>
      <div className="flex flex-row items-center">
        <div className="text-l">
          Price will be {isHigherChosen ? 'higher' : 'smaller'} than the target price
        </div>
        <input 
          type="checkbox"
          checked={isHigherChosen}
          onChange={(e) => setIsHigherChosen(e.target.checked)}
          style={{ marginLeft: '8px' }}
        />
      </div>
      <button className="btn btn-secondary h-[3rem] min-h-[3rem] mt-16 ml-32" onClick={() => createBet()}>
        Create your bet!
      </button>
      <div>
        Current Block No: {currentBlockNumber}
      </div>
    </div>
  );
};

export default CreateBet;
