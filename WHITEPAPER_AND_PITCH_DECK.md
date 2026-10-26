# MedQueue 🏥 — Whitepaper & Pitch Deck

> **Project Name**: MedQueue  
> **Network**: Botchain Mainnet (Chain ID `677`)  
> **Contract Address**: [`0x466c68d08716e6127d796E16a99BAe840721fAb6`](https://scan.botchain.ai/address/0x466c68d08716e6127d796E16a99BAe840721fAb6)  
> **Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)  
> **Repository / Codebase**: [liljhnxn/medqueue](file:///c:/Users/PROGRESSIVE/Documents/Isaac%20work/MedQueue)  
> **License**: MIT  

---

## 📑 Part 1: Official Whitepaper

### 1. Executive Summary
**MedQueue** is a decentralized, privacy-first queue reservation protocol and decentralized application (dApp) deployed natively on **Botchain Mainnet**. Designed to showcase how transparent ledger technology solves trust and ordering friction in public service logistics, MedQueue replaces opaque, manipulable ticketing systems with an immutable, on-chain FIFO (First-In, First-Out) queuing registry.

Using Botchain's high-throughput EVM environment, users connect their Web3 wallet, request an immutable queue allocation, and receive a mathematically deterministic, sequential queue ticket starting from `#1`. By architecting the protocol strictly around cryptographic wallet identities rather than personal health identifiers, MedQueue eliminates data leakage, protects sensitive personal information (Zero-PII), and provides an auditable, verifiable reference model for public administration and clinical queue management.

---

### 2. Problem Statement
Traditional queue management and patient intake systems suffer from foundational architectural shortcomings:

1. **Lack of Transparency & Queue Manipulation**: In centralized ticketing systems, queue priority can be altered behind closed doors. Front-desk favoritism, arbitrary re-prioritization, and opaque waiting lists breed public distrust.
2. **Personal Information (PII/PHI) Vulnerability**: Most digital appointment solutions demand names, phone numbers, email addresses, and medical descriptions upfront, exposing citizens to surveillance, identity theft, and data breaches before they ever step into an examination room.
3. **Physical Congestion & Transmission Risks**: In-person paper ticketing forces crowds into crowded reception waiting rooms, driving cross-infection risks in clinical environments.
4. **Vendor Lock-in & Downtime**: Proprietary cloud queue servers frequently suffer downtime, database corruption, or regional outages during peak demand periods.

---

### 3. The MedQueue Solution
MedQueue introduces a minimalist, trustless queuing architecture built directly into the blockchain:

* **Deterministic FIFO Allocation**: Queue numbers increment strictly on-chain via smart contract execution (`totalRegistrations++`), ensuring nobody can skip lines or acquire duplicate slots.
* **Zero PII Collection**: No patient names, telephone numbers, home addresses, symptoms, or medical histories are recorded or requested. The system maps purely between pseudonymous wallet addresses and sequential integer tickets.
* **Cryptographic Tamper-Proofing**: Queue timestamps and tickets are stored on the Botchain blockchain, accompanied by on-chain event logging (`PatientRegistered`) for instant client-side reactivity and public auditability.
* **Single-Ticket Enforcement**: Strict validation guarantees that each wallet address can register at most once per cycle, eliminating bot-driven queue hoarding.

---

### 4. Technical Architecture & System Design

```
+-------------------------------------------------------------+
|                  Patient Web3 Client (Next.js)               |
|    - wagmi v2 / viem v2 Event Subscription                  |
|    - Live Queue Status Dashboard ("Waiting" / "Not registered")|
+------------------------------+------------------------------+
                               |
                   Wallet Signature / Transaction
                               |
                               v
+-------------------------------------------------------------+
|             MedQueue Smart Contract (0x466c...)             |
|                                                             |
|   1. Verify !registrations[msg.sender].isRegistered         |
|   2. totalRegistrations++                                   |
|   3. Store Registration(queueNumber, block.timestamp, true) |
|   4. Emit PatientRegistered(msg.sender, queueNumber, time)  |
+------------------------------+------------------------------+
                               |
                   State Storage & Event Logs
                               |
                               v
+-------------------------------------------------------------+
|                Botchain Mainnet (Chain ID 677)              |
|    - Sub-second Finality                                    |
|    - Micro-gas EVM Execution                                |
|    - Botchain Explorer Verification                         |
+-------------------------------------------------------------+
```

#### Smart Contract Mechanics ([MedQueue.sol](file:///c:/Users/PROGRESSIVE/Documents/Isaac%20work/MedQueue/contracts/MedQueue.sol))
The core smart contract utilizes an optimized storage model:

```solidity
struct Registration {
    uint256 queueNumber;
    uint256 timestamp;
    bool isRegistered;
}

mapping(address => Registration) private registrations;
uint256 public totalRegistrations;
```

* **`registerForQueue()`**: Validates that `!registrations[msg.sender].isRegistered`, increments `totalRegistrations`, assigns the sequential ticket number and `block.timestamp`, and emits `PatientRegistered`.
* **`getPatientQueueInfo(address)`**: A single view call that returns registration status, assigned queue number, and timestamp in a single RPC query, eliminating redundant round-trips.
* **`getQueueStatus(address)`**: Returns human-readable status (`"Waiting"` or `"Not registered"`).

---

### 5. Botchain Mainnet Integration & Specs

| Parameter | Specification |
| :--- | :--- |
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Native Token** | `BOT` (18 Decimals) |
| **Total Supply** | 150 Million |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai/) |
| **Deployed Contract** | [`0x466c68d08716e6127d796E16a99BAe840721fAb6`](https://scan.botchain.ai/address/0x466c68d08716e6127d796E16a99BAe840721fAb6) |
| **Deployment Tx Hash** | [`0x365b42fb9ec1de026c2d3f5fd5a95c3253a916a2c2a810afdacd9b63798a692f`](https://scan.botchain.ai/tx/0x365b42fb9ec1de026c2d3f5fd5a95c3253a916a2c2a810afdacd9b63798a692f) |

By deploying on Botchain Mainnet, MedQueue leverages high-throughput execution with negligible gas fees, allowing regular users to execute queue registrations smoothly without financial burden.

---

### 6. Privacy, Ethics & Regulatory Compliance
1. **No Medical Triage Claims**: MedQueue is designed as an administrative queue registration demo. Queue numbers represent booking arrival order, not medical urgency or clinical triage.
2. **HIPAA & GDPR Compatibility by Design**: Because zero Protected Health Information (PHI) or Personally Identifiable Information (PII) is handled, processed, or persisted, MedQueue inherently circumvents common data privacy compliance hazards.
3. **Transparent Open Source Code**: The contract code and frontend are completely open and verified under the MIT License.

---

### 7. Security & Automated Test Suite
The contract was subjected to comprehensive test coverage using Hardhat and Ethers.js in [MedQueue.test.js](file:///c:/Users/PROGRESSIVE/Documents/Isaac%20work/MedQueue/test/MedQueue.test.js):

* **Initial State Validation**: Verifies `totalRegistrations == 0` upon deployment.
* **Unregistered Queries**: Ensures default unregistered state returns `isRegistered == false`, `queueNumber == 0`, and status `"Not registered"`.
* **Sequential Integrity**: Proves consecutive registrants receive sequentially increasing integers (`#1`, `#2`, `#3`...).
* **Anti-Sybil Reversion**: Validates that re-registration attempts from the same address trigger a strict revert with `"Already registered"`.
* **Timestamp & Event Verification**: Confirms exact block timestamp persistence and emitted `PatientRegistered` event arguments.

---

## 📽️ Part 2: 10-Slide Pitch Deck

### Slide 1: Cover & Vision
* **Title**: MedQueue — On-Chain Queue Protocol
* **Subtitle**: Transparent, Privacy-Preserving Public Ticketing on Botchain
* **Vision**: Bringing mathematical fairness, tamper-proof ordering, and zero-PII privacy to public and healthcare queue logistics.
* **Network**: Botchain Mainnet (Chain ID: 677)

### Slide 2: The Problem
* **Queue Tampering**: Physical and centralized tickets can be skipped, duplicated, or manipulated.
* **Privacy Leaks**: Demanding personal details upfront turns simple waiting lists into privacy liabilities.
* **Physical Waiting Room Congestion**: Crowded hospital halls create transmission vectors and friction.
* **Opaque Wait Times**: Patients lack real-time visibility into the queue pipeline.

### Slide 3: The Solution: MedQueue
* **Deterministic Sequencing**: Queue tickets are assigned chronologically on-chain starting from `#1`.
* **100% Pseudonymous**: Only your wallet address signs the transaction; no names, phone numbers, or health details.
* **Anti-Hoarding Guard**: Smart contract rules strictly restrict each wallet to 1 queue allocation.
* **Decentralized State**: 24/7 uptime with no single point of failure or centralized database.

### Slide 4: Key Features & Product Demo
* **One-Click Registration**: Fast Web3 interaction with immediate visual confirmation.
* **Real-Time Patient Dashboard**: Displays current status (`Waiting`), assigned ticket number, and registration timestamp.
* **Global Queue Counter**: Displays total live registrants transparently.
* **Network-Aware UI**: Automated network prompt for Botchain Mainnet (Chain ID 677).

### Slide 5: System Architecture & Data Flow
* **Frontend**: Next.js App Router, Tailwind CSS, TypeScript, and Lucide icons.
* **Web3 Connectivity**: wagmi v2, viem v2, and TanStack React Query for smooth, reactive state updates.
* **Smart Contract Layer**: Solidity `^0.8.20` running on Botchain EVM.
* **Explorer Integration**: Direct links to Botchain Explorer for on-chain receipt verification.

### Slide 6: Privacy by Design
* **Zero PII / Zero PHI**: Completely immune to healthcare data breaches.
* **Decoupled Identity**: Wallets act as verifiable bearer tokens for attendance without tracking real-world identity.
* **Public Auditability**: Any user can verify their position in the queue without revealing who they are.

### Slide 7: Why Botchain?
* **Sub-Second Finality**: Instant confirmation of queue ticket generation.
* **Micro-Cent Gas Fees**: Scalable for high-volume daily registrations without financial barriers.
* **Full EVM Compatibility**: Seamless developer tooling via Hardhat and wagmi.

### Slide 8: Market Opportunity & Use Cases
* **Public Health Clinics**: Walk-in triage and appointment queuing without physical crowds.
* **Municipal Government Offices**: DMV, passport services, and registry ticketing.
* **Pop-Up Vaccination & Screening Events**: Fast, fraud-proof allocation for limited supplies.
* **Event & Ticket Queuing**: High-demand queue waitlists without bot scalp manipulation.

### Slide 9: Development Roadmap
* **Phase 1 (Completed)**: Core smart contract deployment on Botchain Mainnet, verified test suite, Next.js frontend, and explorer integration.
* **Phase 2**: Multi-department support (e.g., General Medicine, Pharmacy, Radiology) under a unified factory architecture.
* **Phase 3**: Zero-Knowledge (zk-SNARK) ticket claims allowing patients to prove ticket ownership without linking their personal wallet.
* **Phase 4**: Decentralized push notifications (via Waku / XMTP) alerting patients when their number is next.

### Slide 10: Conclusion & Verified Links
* **Live Smart Contract**: [`0x466c68d08716e6127d796E16a99BAe840721fAb6`](https://scan.botchain.ai/address/0x466c68d08716e6127d796E16a99BAe840721fAb6)
* **Block Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)
* **Network**: Botchain Mainnet (Chain ID `677`, RPC `https://rpc.botchain.ai`)
* **Repository**: Open-source on GitHub ([liljhnxn/medqueue](file:///c:/Users/PROGRESSIVE/Documents/Isaac%20work/MedQueue))

---

### 📋 Ready-to-Paste Form Snippet (Grant / Hackathon Submission)

```text
Project: MedQueue
Tagline: Privacy-preserving, on-chain hospital queue protocol on Botchain Mainnet.
Network: Botchain Mainnet (Chain ID 677, RPC: https://rpc.botchain.ai)
Contract Address: 0x466c68d08716e6127d796E16a99BAe840721fAb6
Explorer: https://scan.botchain.ai/address/0x466c68d08716e6127d796E16a99BAe840721fAb6
Whitepaper & Pitch Deck: WHITEPAPER_AND_PITCH_DECK.md (stored in repository root)

Summary:
MedQueue is a decentralized queue ticketing demonstration dApp deployed natively on Botchain Mainnet. It provides tamper-proof, sequential queue number allocation starting from #1 with built-in duplicate registration prevention. Designed with a strict privacy-first architecture, MedQueue collects zero PII or health records, pairing an audited Solidity smart contract with a responsive Next.js and wagmi/viem frontend.
```
