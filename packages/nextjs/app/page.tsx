"use client";

import type { NextPage } from "next";
import BetHistory from "~~/components/bets/BetHistory";
import CreateBet from "~~/components/bets/CreateBet";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex flex-row sm:flex-row flex-grow pt-16 px-8 py-8 gap-32">
        <div className="rounded-3xl" style={{ flex: 2, width: "20%", backgroundColor: "#004D40" }}>
          <CreateBet/>
        </div>
        <div className="rounded-3xl" style={{ flex: 5, width: "70%", backgroundColor: "#E3A856" }}>
          <BetHistory/>
        </div>
      </div>
    </>
  );
};

export default Home;
