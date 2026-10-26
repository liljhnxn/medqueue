require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const BOTCHAIN_RPC_URL =
  process.env.BOTCHAIN_RPC_URL ||
  process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL ||
  "https://rpc.botchain.ai";

let privateKey = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.trim() : "";
if (privateKey && !privateKey.startsWith("0x") && privateKey.length === 64) {
  privateKey = `0x${privateKey}`;
}

const accounts = privateKey && privateKey.length === 66 ? [privateKey] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    botchainMainnet: {
      url: BOTCHAIN_RPC_URL,
      chainId: 677,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: {
      botchainMainnet: "any",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};
