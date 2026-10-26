export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x466c68d08716e6127d796E16a99BAe840721fAb6") as `0x${string}`;

export const MED_QUEUE_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "patient", type: "address" },
      { indexed: false, internalType: "uint256", name: "queueNumber", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "PatientRegistered",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "patient", type: "address" }],
    name: "getPatientQueueInfo",
    outputs: [
      { internalType: "bool", name: "registered", type: "bool" },
      { internalType: "uint256", name: "queueNumber", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "patient", type: "address" }],
    name: "getQueueNumber",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "patient", type: "address" }],
    name: "getQueueStatus",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "patient", type: "address" }],
    name: "getRegistrationTimestamp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "patient", type: "address" }],
    name: "isRegistered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registerForQueue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRegistrations",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
