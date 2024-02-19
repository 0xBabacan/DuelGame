import React, { useEffect, useState } from "react";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { parseEther, createPublicClient } from "viem";
import { getBlockNumber } from '@wagmi/core'
import { Web3 } from "web3"

const CreateBet = () => {
  
  const [currentTimestamp, setCurrentTimestamp] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [isHigherChosen, setIsHigherChosen] = useState(true);
  const [targetTimestamp, setTargetTimestamp] = useState<string>("");
  const [betAmount, setBetAmount]  = useState<string>("");

  const { writeAsync: createBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "createBet",
    value: parseEther(betAmount),
    args: [BigInt(targetPrice), isHigherChosen, BigInt(targetTimestamp)],
  });

  useEffect(() => {
    const fetchCurrentTimestamp = () => {
      const dateTime = new Date();
      const timestamp = Math.floor(dateTime.getTime() / 1000);
      setCurrentTimestamp(timestamp.toString()); 
    }
    fetchCurrentTimestamp();
    const intervalId = setInterval(fetchCurrentTimestamp, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const convertToTimestamp = (dateTimeString) => {
    const selectedDateTime = new Date(dateTimeString);
    const timestamp = Math.floor(selectedDateTime.getTime() / 1000);   // Milliseconds to seconds conversion
    setTargetTimestamp(timestamp.toString());
  }

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
        <div className="w-full text-l">Bet amount:</div>
        <input
          type="text"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          style={{ width: "80px", color: "#EBF5FF", background: "#002060", border: "1px solid #EBF5FF", borderRadius: "8px", ring: "1px solid indigo", ringColor: "indigo", paddingLeft: "6px", outline: "none"}}
        />
      </div>
      <div className="flex flex-row">
        <div className="w-full text-l">Deadline:</div>
        <input
          type="datetime-local"
          onChange={(e) => convertToTimestamp(e.target.value)}
          style={{ width: "500px", color: "#EBF5FF", background: "#002060", border: "1px solid #EBF5FF", borderRadius: "8px", ring: "1px solid indigo", ringColor: "indigo", paddingLeft: "6px", outline: "none"}}
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
      <div style={{ marginTop: '3rem' }}></div>
      <div className="block text-l font-bold">
        Current Timestamp: {currentTimestamp}
      </div>
      <span  style={{ fontSize: '0.8em' }}>*Please note that the timestamp data from the Sepolia network is delayed compared to the standard.</span>
    </div>
  );
};

export default CreateBet;
