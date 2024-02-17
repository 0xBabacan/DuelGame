/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    DuelContract: {
      address: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
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
              internalType: "uint256",
              name: "targetPrice",
              type: "uint256",
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
              name: "lastBlockNumber",
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
              internalType: "uint256",
              name: "targetPrice",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isHigherChosen",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "lastBlockNumber",
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
              internalType: "uint256",
              name: "_targetPrice",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "_isHigherChosen",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "_lastBlockNumber",
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
          ],
          name: "finishBet",
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
          ],
          name: "getBetState",
          outputs: [
            {
              internalType: "enum DuelContract.BetState",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
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
          name: "timeOutBlockNumber",
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
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
