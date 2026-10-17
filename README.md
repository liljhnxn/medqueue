# MedQueue — Hospital Queue Number Demo on Botchain Testnet

MedQueue is a simple, lightweight Web3 hospital queue demonstration dApp built for the **Botchain Testnet** (Chain ID: 968). It allows patients to connect their Web3 wallet, register for an on-chain queue number, and monitor their status in real time.

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
- **Network Awareness**: Auto-detects Botchain Testnet and provides a one-click network switch prompt if connected to an unsupported network.
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

## Botchain Testnet Parameters

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Native Currency** | BOT (18 decimals) |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life/) |

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
# Botchain Testnet RPC
BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.bohr.life

# Deployed Smart Contract Address (set after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=

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

### Deploy to Botchain Testnet

Ensure `PRIVATE_KEY` in `.env.local` contains a funded Botchain Testnet wallet (with BOT for gas), then run:

```bash
npm run deploy:botchain
```

Output example:
```text
=================================================
 CONTRACT DEPLOYED SUCCESSFULLY!
=================================================
Contract Address: 0xFC841F53c095265BABf94856a4a248Bf0ba4CFBc
Deployment Tx Hash: 0xf6b239b1154ea8991c4b0902c9b9d679cd7a45dcdf5aaf1bf850b8ec6c27a581
Explorer Link: https://scan.bohr.life/address/0xFC841F53c095265BABf94856a4a248Bf0ba4CFBc
=================================================
```

### Verify Contract on Botchain Explorer

To verify your contract source code on the Botchain block explorer:

```bash
npm run verify:botchain <CONTRACT_ADDRESS>
```

Example:
```bash
npx hardhat verify --network botchainTestnet 0xFC841F53c095265BABf94856a4a248Bf0ba4CFBc
```

Verified contract code is publicly visible on [Botchain Explorer](https://scan.bohr.life/address/0xFC841F53c095265BABf94856a4a248Bf0ba4CFBc#code).

### Configure Frontend with Deployed Address

Copy the deployed contract address and set it in `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
```

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
   - `NEXT_PUBLIC_BOTCHAIN_RPC_URL`: `https://rpc.bohr.life`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: `<Your deployed contract address on Botchain Testnet>`
5. Click **Deploy**.
6. Once deployed, test the dApp with a MetaMask or compatible browser wallet connected to Botchain Testnet.

---

## License

MIT
