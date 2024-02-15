"use client";

import type { NextPage } from "next";
import BetList from "~~/components/bets/BetList";
import CreateBet from "~~/components/bets/CreateBet";
import FinishedBets from "~~/components/bets/FinishedBets";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex flex-col flex-grow pt-16 px-8 py-12 gap-12 sm:flex-row">
        <div className="bg-base-200 max-w-lg rounded-3xl" style={{ flex: 1, backgroundColor: 'darkgreen' }}>
          {<CreateBet/>}
        </div>
        <div>
          {<BetList/>}
        </div>
        <div className="bg-base-200 max-w-lg">
          {<FinishedBets/>}
        </div>
      </div>
    </>
  );
};

export default Home;
