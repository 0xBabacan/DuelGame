export type BetCreatedProps = {
  betId: number;
  player1: string;
  targetPrice: number;
  betAmount: number;
  lastBlockNumber: number;
};

export type BetAcceptedProps = {
  betId: number;
  player1: string;
  player2: string;
};

export type BetFinishedProps = {
  betId: number;
  winner: string;
  state: number;
};

export type DuelGameProps = {
  bet: BetCreatedProps;
  isBetAccepted?: boolean;
  isBetFinished?: boolean;
  currentPlayer?: string;
};
