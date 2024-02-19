/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  11155111: {
    DuelContract: {
      address: "0xcAa089C37765756B82A65F9650704241C6AbF8D1",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "betId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "player2",
              type: "address",
            },
          ],
          name: "BetAccepted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "betId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "player1",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "int256",
              name: "targetPrice",
              type: "int256",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "isHigherChosen",
              type: "bool",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "targetTimestamp",
              type: "uint256",
            },
          ],
          name: "BetCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "betId",
              type: "uint256",
            },
          ],
          name: "BetDeleted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "betId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "winner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "loser",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "BetFinished",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_betId",
              type: "uint256",
            },
          ],
          name: "acceptBet",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "betIdCounter",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "bets",
          outputs: [
            {
              internalType: "address",
              name: "player1",
              type: "address",
            },
            {
              internalType: "address",
              name: "player2",
              type: "address",
            },
            {
              internalType: "enum DuelContract.BetState",
              name: "state",
              type: "uint8",
            },
            {
              internalType: "int256",
              name: "targetPrice",
              type: "int256",
            },
            {
              internalType: "bool",
              name: "isHigherChosen",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "targetTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "int256",
              name: "_targetPrice",
              type: "int256",
            },
            {
              internalType: "bool",
              name: "_isHigherChosen",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "_targetTimestamp",
              type: "uint256",
            },
          ],
          name: "createBet",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_betId",
              type: "uint256",
            },
          ],
          name: "deleteBet",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_betId",
              type: "uint256",
            },
            {
              internalType: "int256",
              name: "_priceAtBetFinished",
              type: "int256",
            },
          ],
          name: "finishBet",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getLatestPrice",
          outputs: [
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "timeoutValueForOneHour",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
