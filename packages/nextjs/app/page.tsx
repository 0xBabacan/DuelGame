"use client";

import type { NextPage } from "next";
import BetList from "~~/components/bets/BetList";
import CreateBet from "~~/components/bets/CreateBet";
import FinishedBets from "~~/components/bets/FinishedBets";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex flex-col flex-grow pt-16 px-8 py-12 gap-8 sm:flex-row">
        <div className="bg-base-200 rounded-3xl max-w-lg" style={{ flex: 1, backgroundColor: "#004D40" }}>
          <CreateBet/>
        </div>
        <div className="bg-base-200 rounded-3xl" style={{ flex: 1, backgroundColor: "#F5A558" }}>
          <BetList/>
        </div>
        <div className="bg-base-200 rounded-3xl max-w-lg" style={{ flex: 1, backgroundColor: 'coral' }}>
          <FinishedBets/>
        </div>
      </div>
    </>
  );
};

export default Home;
