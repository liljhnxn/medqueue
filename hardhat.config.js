require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const BOTCHAIN_RPC_URL =
  process.env.BOTCHAIN_RPC_URL ||
  process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL ||
  "https://rpc.bohr.life";

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
    botchainTestnet: {
      url: BOTCHAIN_RPC_URL,
      chainId: 968,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: {
      botchainTestnet: "any",
    },
    customChains: [
      {
        network: "botchainTestnet",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};
