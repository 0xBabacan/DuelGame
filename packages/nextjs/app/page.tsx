"use client";

import type { NextPage } from "next";
import BetHistory from "~~/components/bets/BetHistory";
import CreateBet from "~~/components/bets/CreateBet";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex flex-col flex-grow pt-16 px-8 py-12 gap-32 ml-16 mr-16 sm:flex-row">
        <div className="bg-base-200 rounded-3xl max-w-lg" style={{ flex: 1, backgroundColor: "#004D40" }}>
          <CreateBet/>
        </div>
        <div className="bg-base-300 rounded-3xl" style={{ flex: 1, backgroundColor: "#E3A856" }}>
          <BetHistory/>
        </div>
      </div>
    </>
  );
};

export default Home;
