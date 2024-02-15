import React from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
//import { useAccount } from "wagmi";
import { parseEther  } from "viem";
import { useState } from "react";

const CreateBet = () => {
  
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
/*
  const toggleCheckbox = (isChecked) => {
    setIsHigherChosen(isChecked);
  }
*/
  return (
    <div className="px-8 py-12 space-y-3">
      <div className="flex flex-row">
        <div className="w-full text-l">Target ETH price:</div>
        <input
          type="number"
          value={targetPrice}
          onChange={e => setTargetPrice(e.target.value)}
          style={{ marginLeft: '8px' }}
        />
      </div>
      <div className="flex flex-row">
        <div className="w-full text-l">Last block number for deadline:</div>
        <input
          type="number"
          value={lastBlockNumber}
          onChange={e => setLastBlockNumber(e.target.value)}
          style={{ marginLeft: '8px' }}
        />
      </div>
      <div className="flex flex-row">
        <div className="w-full text-l">Bet amount:</div>
        <input
          type="number"
          value={betAmount}
          onChange={e => setBetAmount(e.target.value)}
          style={{ marginLeft: '8px' }}
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
    </div>
  );
};

export default CreateBet;
