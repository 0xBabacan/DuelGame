import React, { useState } from "react";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";

// REGEX for number inputs (only allow numbers and a single decimal point)
export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

const CreateBet = () => {
  
  const [targetPrice, setTargetPrice] = useState("");
  const [isHigherChosen, setIsHigherChosen] = useState(true);
  const [targetTimestamp, setTargetTimestamp] = useState<string>("");
  const [betAmount, setBetAmount]  = useState<string>("");

  const { writeAsync: createBet } = useScaffoldContractWrite({
    contractName: "DuelContract",
    functionName: "createBet",
    value: parseEther(betAmount),
    args: [
      NUMBER_REGEX.test(targetPrice) ? parseEther(targetPrice) : targetPrice, 
      isHigherChosen, 
      BigInt(targetTimestamp
    )],
  });

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
          onChange={(e) => setTargetPrice(e.target.value.toString())}
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
        <div className="text-l">Price will be {isHigherChosen ? 'higher' : 'smaller'} than the target price:</div>
        <div className="ml-2" style={{ fontSize: '0.9em' }}>
          <button className={`bg-gray-200 px-2 py-1 rounded-lg text-gray-700 hover:bg-gray-300 ${isHigherChosen ? 'font-bold' : ''}`}
            onClick={() => setIsHigherChosen(true)}
          >
            Higher
          </button>
          <button className={`ml-2 bg-gray-200 px-2 py-1 rounded-lg text-gray-700 hover:bg-gray-300 ${!isHigherChosen ? 'font-bold' : ''}`}
            onClick={() => setIsHigherChosen(false)}
          >
            Smaller
          </button>
        </div>
      </div>
      <button className="btn btn-secondary h-[3rem] min-h-[3rem] mt-16 ml-32" onClick={() => createBet()}>
        Create your bet!
      </button>
      <div style={{ marginTop: '3rem' }}></div>
      <span style={{ fontSize: '0.8em', fontStyle: 'italic' }}>
        *Please note that using chainlink in Sepolia Network to get the price cannot promise the price data at the target timestamp is the latest 
        because the data feed will be updated if the price alternates more than the deviation threshold. 
        Therefore, we apologize in advance for any potential losses that may occur due to this situation. Have fun!
      </span>
    </div>
  );
};

export default CreateBet;
