"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, MED_QUEUE_ABI } from "@/config/contract";
import { botchainTestnet } from "@/config/chain";
import {
  Users,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldAlert,
  Info,
  Calendar,
  Sparkles
} from "lucide-react";

export function QueueDashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isConfigured = Boolean(
    CONTRACT_ADDRESS && CONTRACT_ADDRESS.startsWith("0x") && CONTRACT_ADDRESS.length === 42
  );
  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Read total registrations
  const {
    data: totalRegistrations,
    refetch: refetchTotal,
  } = useReadContract({
    address: isConfigured ? CONTRACT_ADDRESS : undefined,
    abi: MED_QUEUE_ABI,
    functionName: "totalRegistrations",
    query: {
      enabled: isConfigured,
      refetchInterval: 10000,
    },
  });

  // Read patient info: [registered, queueNumber, timestamp]
  const {
    data: patientInfo,
    refetch: refetchPatient,
  } = useReadContract({
    address: isConfigured && address ? CONTRACT_ADDRESS : undefined,
    abi: MED_QUEUE_ABI,
    functionName: "getPatientQueueInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: isConfigured && Boolean(address),
      refetchInterval: 10000,
    },
  });

  const isPatientRegistered = Boolean(patientInfo && patientInfo[0]);
  const patientQueueNumber = patientInfo ? Number(patientInfo[1]) : 0;
  const patientTimestamp = patientInfo ? Number(patientInfo[2]) : 0;

  // Contract write for registration
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for receipt
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Refresh upon confirmation
  useEffect(() => {
    if (isConfirmed) {
      refetchTotal();
      refetchPatient();
    }
  }, [isConfirmed, refetchTotal, refetchPatient]);

  // Handle errors
  useEffect(() => {
    if (writeError) {
      const msg = writeError.message || "Failed to submit transaction";
      if (msg.includes("Already registered")) {
        setErrorMessage("This wallet has already registered for a queue number.");
      } else if (msg.includes("User rejected")) {
        setErrorMessage("Transaction was cancelled in your wallet.");
      } else {
        setErrorMessage(msg.slice(0, 160));
      }
    } else if (confirmError) {
      setErrorMessage(confirmError.message?.slice(0, 160) || "Transaction confirmation failed.");
    } else {
      setErrorMessage(null);
    }
  }, [writeError, confirmError]);

  const handleRegister = async () => {
    setErrorMessage(null);
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }
    if (isWrongNetwork) {
      setErrorMessage("Please switch to Botchain Testnet (Chain ID 968).");
      return;
    }
    if (!isConfigured) {
      setErrorMessage("Smart contract is not configured. Please deploy the contract first.");
      return;
    }
    if (isPatientRegistered) {
      setErrorMessage("You are already registered.");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MED_QUEUE_ABI,
        functionName: "registerForQueue",
      });
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj.message || "Unexpected error occurred.");
    }
  };

  const formattedDate = patientTimestamp
    ? new Date(patientTimestamp * 1000).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const isTxProcessing = isWritePending || isConfirming;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Missing Contract Configuration Banner */}
      {!isConfigured && (
        <div className="rounded-xl border border-border bg-[#1B2730] p-4 sm:p-5 flex items-start gap-3">
          <Info className="w-5 h-5 text-tealAccent shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <h4 className="font-medium text-mainText">Contract Address Not Configured</h4>
            <p className="text-secondaryText leading-relaxed">
              To interact with the live blockchain, compile and deploy the smart contract to Botchain Testnet:
            </p>
            <div className="pt-2 font-mono text-xs bg-[#101820] p-2.5 rounded-lg border border-border text-tealAccent select-all overflow-x-auto">
              npx hardhat run scripts/deploy.js --network botchainTestnet
            </div>
            <p className="text-secondaryText text-xs pt-1">
              Then paste the deployed address into <code className="text-mainText">NEXT_PUBLIC_CONTRACT_ADDRESS</code> in your <code className="text-mainText">.env.local</code> file and restart the development server.
            </p>
          </div>
        </div>
      )}

      {/* Network Switch Notice */}
      {isWrongNetwork && (
        <div className="rounded-xl border border-errorRed/40 bg-errorRed/10 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-errorRed shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-mainText">Incorrect Network Detected</span>
              <p className="text-secondaryText text-xs">
                MedQueue is deployed on Botchain Testnet (Chain ID 968).
              </p>
            </div>
          </div>
          <button
            onClick={() => switchChain({ chainId: botchainTestnet.id })}
            className="px-3 py-1.5 rounded-lg bg-errorRed text-[#101820] text-xs font-semibold hover:bg-opacity-90 transition-opacity shrink-0"
          >
            Switch Network
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center space-y-3 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B2730] border border-border text-xs text-tealAccent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Botchain Testnet Demo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-mainText tracking-tight">
          Your Place in the Queue.
        </h1>
        <p className="text-base sm:text-lg text-secondaryText max-w-xl mx-auto">
          A simple, transparent way to track your queue registration.
        </p>
        <p className="text-xs text-secondaryText/80">
          Demo application — not for real hospital use.
        </p>
      </section>

      {/* Queue Information Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Your Queue Number */}
        <div className="rounded-xl bg-[#1B2730] border border-border p-5 flex flex-col justify-between hover:border-border/80 transition-colors">
          <div className="flex items-center justify-between text-secondaryText mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Your Queue Number</span>
            <Ticket className="w-4 h-4 text-tealAccent" />
          </div>
          <div className="mt-2">
            <span className="text-3xl sm:text-4xl font-bold text-mainText">
              {isConnected && isPatientRegistered ? `#${patientQueueNumber}` : "—"}
            </span>
          </div>
          <p className="text-xs text-secondaryText mt-3">
            {isConnected
              ? isPatientRegistered
                ? "Your allocated queue number"
                : "Register below to obtain one"
              : "Connect wallet to view"}
          </p>
        </div>

        {/* Total Registrations */}
        <div className="rounded-xl bg-[#1B2730] border border-border p-5 flex flex-col justify-between hover:border-border/80 transition-colors">
          <div className="flex items-center justify-between text-secondaryText mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Registrations</span>
            <Users className="w-4 h-4 text-tealAccent" />
          </div>
          <div className="mt-2">
            <span className="text-3xl sm:text-4xl font-bold text-mainText">
              {totalRegistrations !== undefined ? totalRegistrations.toString() : "0"}
            </span>
          </div>
          <p className="text-xs text-secondaryText mt-3">
            Verified on-chain registrations
          </p>
        </div>

        {/* Registration Status */}
        <div className="rounded-xl bg-[#1B2730] border border-border p-5 flex flex-col justify-between hover:border-border/80 transition-colors">
          <div className="flex items-center justify-between text-secondaryText mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Registration Status</span>
            <Clock className="w-4 h-4 text-tealAccent" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            {isConnected && isPatientRegistered ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tealAccent/15 text-tealAccent text-sm font-semibold border border-tealAccent/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tealAccent animate-ping" />
                Waiting
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101820] text-secondaryText text-sm font-medium border border-border">
                Not registered
              </span>
            )}
          </div>
          <p className="text-xs text-secondaryText mt-3">
            Current queue status
          </p>
        </div>
      </section>

      {/* Register Card */}
      <section className="rounded-2xl bg-[#1B2730] border border-border p-6 sm:p-8 space-y-6">
        <div className="border-b border-border/80 pb-4">
          <h2 className="text-xl font-semibold text-mainText">
            Hospital Queue Registration
          </h2>
          <p className="text-xs sm:text-sm text-secondaryText mt-1">
            Obtain your sequential queue position securely on the Botchain Testnet.
          </p>
        </div>

        {/* State 1: Wallet not connected */}
        {!isConnected ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#101820] border border-border flex items-center justify-center mx-auto text-secondaryText">
              <Ticket className="w-6 h-6 text-tealAccent" />
            </div>
            <p className="text-sm font-medium text-mainText">
              Connect your wallet to get started.
            </p>
            <p className="text-xs text-secondaryText max-w-md mx-auto">
              Please connect your Web3 wallet using the button in the top right to register for a queue position.
            </p>
          </div>
        ) : isPatientRegistered ? (
          /* State 2: Already Registered */
          <div className="py-4 space-y-4">
            <div className="rounded-xl bg-[#101820] border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-tealAccent/10 border border-tealAccent/20 flex items-center justify-center text-tealAccent shrink-0">
                <CheckCircle className="w-6 h-6 text-tealAccent" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-secondaryText">Registration Confirmed</span>
                <p className="text-sm text-mainText font-medium">
                  You are registered with queue number{" "}
                  <span className="text-tealAccent font-bold">#{patientQueueNumber}</span>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* State 3: Connected & Not Registered */
          <div className="space-y-5">
            <div className="rounded-xl bg-[#101820] border border-border p-4 text-xs sm:text-sm text-secondaryText space-y-2">
              <p className="text-mainText font-medium">Registration Instructions:</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Each wallet can register once.</li>
                <li>You will be assigned the next sequential queue number.</li>
                <li>A gas confirmation in BOT will be requested by your wallet.</li>
                <li>No personal data or medical symptoms are requested or recorded.</li>
              </ul>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-errorRed/10 border border-errorRed/30 text-errorRed text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="break-words">{errorMessage}</span>
              </div>
            )}

            {/* Transaction Pending/Confirming Banner */}
            {isTxProcessing && (
              <div className="p-4 rounded-xl bg-tealAccent/10 border border-tealAccent/30 text-tealAccent text-sm flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <div>
                  <p className="font-medium">
                    {isWritePending ? "Waiting for signature in wallet..." : "Confirming transaction on Botchain Testnet..."}
                  </p>
                  {txHash && (
                    <a
                      href={`https://scan.bohr.life/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline inline-flex items-center gap-1 mt-0.5 hover:text-mainText"
                    >
                      View transaction on explorer <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Success state just after confirmation */}
            {isConfirmed && (
              <div className="p-4 rounded-xl bg-successGreen/15 border border-successGreen/30 text-successGreen text-sm flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold">Queue Registration Successful!</p>
                  <p className="text-xs text-mainText mt-0.5">
                    Your queue number has been recorded on-chain.
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleRegister}
                disabled={isTxProcessing || isWrongNetwork || !isConfigured}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-tealAccent text-[#101820] font-semibold text-sm hover:bg-tealAccent-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isTxProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Get Queue Number</span>
                  </>
                )}
              </button>

              {isWrongNetwork && (
                <span className="text-xs text-errorRed">
                  Switch to Botchain Testnet to proceed.
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Queue Information Panel (Section 6.E) */}
      {isConnected && isPatientRegistered && (
        <section className="rounded-2xl bg-[#1B2730] border border-border p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <h3 className="text-lg font-semibold text-mainText">
              Your Queue Details
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tealAccent/15 text-tealAccent text-xs font-semibold border border-tealAccent/30">
              <span className="w-2 h-2 rounded-full bg-tealAccent animate-pulse" />
              Status: Waiting
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#101820] border border-border p-4 space-y-1">
              <span className="text-xs text-secondaryText flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-tealAccent" />
                Assigned Queue Number
              </span>
              <p className="text-2xl font-bold text-mainText">
                #{patientQueueNumber}
              </p>
            </div>

            <div className="rounded-xl bg-[#101820] border border-border p-4 space-y-1">
              <span className="text-xs text-secondaryText flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-tealAccent" />
                Registration Time
              </span>
              <p className="text-sm font-medium text-mainText">
                {formattedDate || "Pending timestamp"}
              </p>
              <p className="text-[11px] text-secondaryText">
                Block timestamp: {patientTimestamp}
              </p>
            </div>
          </div>

          {/* Transparent Notice */}
          <div className="rounded-xl bg-[#101820]/60 border border-border/60 p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-tealAccent shrink-0 mt-0.5" />
            <p className="text-xs text-secondaryText leading-relaxed">
              Queue numbers are assigned in registration order. This demo does not provide medical triage or determine treatment priority.
            </p>
          </div>
        </section>
      )}

      {/* Verification & Network Details info card */}
      <section className="rounded-xl border border-border/60 bg-[#1B2730]/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-secondaryText">
        <div className="space-y-1">
          <p className="font-medium text-mainText">Botchain Testnet Parameters</p>
          <p>Chain ID: 968 • Currency: BOT • RPC: https://rpc.bohr.life</p>
        </div>
        <a
          href="https://scan.bohr.life"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-tealAccent hover:underline"
        >
          <span>Open Botchain Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>
    </div>
  );
}
