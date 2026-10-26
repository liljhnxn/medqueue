# MedQueue — Hospital Queue Number Demo on Botchain Mainnet

MedQueue is a simple, lightweight Web3 hospital queue demonstration dApp built for **Botchain Mainnet** (Chain ID: 677). It allows patients to connect their Web3 wallet, register for an on-chain queue number, and monitor their status in real time.

> **Disclaimer**: This is a portfolio demonstration project, **NOT** a real hospital queue management system. It does not collect or store patient names, phone numbers, addresses, medical records, symptoms, or personal health information. Queue numbers are allocated in registration order and do not imply medical triage or treatment priority.

---

## Features

- **Decentralized Queue Allocation**: Assigns sequential queue numbers starting from 1 via a Solidity smart contract.
- **One Registration per Wallet**: Built-in verification preventing duplicate registrations.
- **Real-Time Blockchain State**:
  - Connected wallet's allocated queue number (`#X` or `—` if unregistered).
  - Total on-chain registration counter.
  - Live status indicator: `Not registered` or `Waiting`.
  - Transparent timestamp tracking.
- **Network Awareness**: Auto-detects Botchain Mainnet and provides a one-click network switch prompt if connected to an unsupported network.
- **Calm, Clinical Aesthetic**: Custom dark theme designed with `#101820` (background), `#1B2730` (card surface), `#30414B` (borders), and `#45C4B0` (teal accent).
- **Graceful Unconfigured State**: Displays setup instructions if the smart contract address is not yet configured, preventing runtime crashes.

---

## Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Web3 / Blockchain**:
  - [wagmi](https://wagmi.sh/) & [viem](https://viem.sh/)
  - [TanStack React Query](https://tanstack.com/query)
- **Smart Contracts & Tooling**:
  - [Solidity](https://soliditylang.org/) (`^0.8.20`)
  - [Hardhat](https://hardhat.org/) (`@nomicfoundation/hardhat-toolbox`)

---

## Botchain Mainnet Parameters

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Native Token** | BOT (18 decimals) |
| **Total Supply** | 150 Million |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Deployed Contract** | [`0x466c68d08716e6127d796E16a99BAe840721fAb6`](https://scan.botchain.ai/address/0x466c68d08716e6127d796E16a99BAe840721fAb6) |

---

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd MedQueue
npm install
```

### 2. Environment Variable Setup

Copy the sample environment file to create your local environment:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Botchain Mainnet RPC
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai

# Deployed Smart Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x466c68d08716e6127d796E16a99BAe840721fAb6

# Deployer Private Key (Keep secret! Do not share or prefix with NEXT_PUBLIC_)
PRIVATE_KEY=your_private_key_here
```

---

## Smart Contract Operations

### Compile Contract

Compile the `MedQueue.sol` smart contract:

```bash
npm run compile
```

### Run Unit Tests

Execute automated tests covering registration order, duplicate prevention, timestamp logging, and event emissions:

```bash
npm test
```

### Deploy to Botchain Mainnet

Ensure `PRIVATE_KEY` in `.env.local` or `.env` contains a funded Botchain Mainnet wallet (with BOT for gas), then run:

```bash
npm run deploy:botchain
```

Output example:
```text
=================================================
 MedQueue Deployment
=================================================
Network: botchainMainnet (Chain ID: 677)
Deployer address: 0x83acc57bb9CDe889b248E9c740F5248637cd89f4
Deployer balance: 0.305958834580366821 BOT
Current gas price: 20.0 Gwei

Deploying MedQueue contract...
=================================================
 CONTRACT DEPLOYED SUCCESSFULLY!
=================================================
Contract Address: 0x466c68d08716e6127d796E16a99BAe840721fAb6
Deployment Tx Hash: 0x365b42fb9ec1de026c2d3f5fd5a95c3253a916a2c2a810afdacd9b63798a692f
Gas Used: 279875
Total Gas Cost: 0.0055975 BOT
Explorer Link: https://scan.botchain.ai/address/0x466c68d08716e6127d796E16a99BAe840721fAb6
=================================================
```

### Verify Contract on Botchain Explorer

To verify your contract source code on the Botchain block explorer:

```bash
npm run verify:botchain 0x466c68d08716e6127d796E16a99BAe840721fAb6
```

Verified contract code is publicly visible on [Botchain Explorer](https://scan.botchain.ai/address/0x466c68d08716e6127d796E16a99BAe840721fAb6#code).

---

## Local Development

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Vercel Deployment Instructions

1. Push your code to a GitHub/GitLab repository.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the `MedQueue` repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_BOTCHAIN_RPC_URL`: `https://rpc.botchain.ai`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: `0x466c68d08716e6127d796E16a99BAe840721fAb6`
5. Click **Deploy**.
6. Once deployed, test the dApp with a MetaMask or compatible browser wallet connected to Botchain Mainnet.

---

## License

MIT
