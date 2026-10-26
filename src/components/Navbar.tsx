"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainMainnet } from "@/config/chain";
import { Wallet, ChevronDown, LogOut, AlertCircle, ExternalLink } from "lucide-react";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainMainnet.id;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="w-full border-b border-border bg-[#101820]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1B2730] border border-border flex items-center justify-center text-tealAccent shadow-sm">
            {/* Medical Cross Icon */}
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5 4.5a1.5 1.5 0 0 1 3 0v4.5h4.5a1.5 1.5 0 0 1 0 3h-4.5v4.5a1.5 1.5 0 0 1-3 0V12h-4.5a1.5 1.5 0 0 1 0-3h4.5V4.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-mainText tracking-tight">MedQueue</span>
          </div>
        </div>

        {/* Network, Ecosystem Links and Wallet Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* BOT Chain Website Nav Link with Logo at Front */}
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-secondaryText hover:text-mainText hover:bg-[#1B2730] transition-colors"
            title="BOT Chain Official Website"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Logo"
              className="w-3.5 h-3.5 object-contain rounded shrink-0"
            />
            <span>BOT Chain</span>
            <ExternalLink className="w-3 h-3 text-secondaryText" />
          </a>

          {/* Mainnet Explorer Direct Nav Link with Logo at Front */}
          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-secondaryText hover:text-mainText hover:bg-[#1B2730] transition-colors"
            title="Open BOT Chain Explorer"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Logo"
              className="w-3.5 h-3.5 object-contain rounded shrink-0"
            />
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-secondaryText" />
          </a>

          {/* Botchain Mainnet Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B2730] border border-border text-xs text-secondaryText">
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Logo"
              className="w-3.5 h-3.5 object-contain rounded shrink-0"
            />
            <span className="font-medium text-mainText">Botchain Mainnet</span>
          </div>

          {/* Network Switch Prompt if on Wrong Network */}
          {isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainMainnet.id })}
              disabled={isSwitching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-errorRed/15 text-errorRed border border-errorRed/30 text-xs font-medium hover:bg-errorRed/25 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isSwitching ? "Switching..." : "Switch to Botchain Mainnet"}</span>
            </button>
          )}

          {/* Wallet Button */}
          {!isConnected ? (
            <button
              onClick={() => {
                const connector = connectors[0];
                if (connector) {
                  connect({ connector });
                }
              }}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-tealAccent text-[#101820] font-semibold text-sm hover:bg-tealAccent-hover transition-colors shadow-sm disabled:opacity-60"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1B2730] border border-border text-mainText text-sm font-medium hover:border-tealAccent/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-successGreen" />
                <span>{address ? formatAddress(address) : "Connected"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-secondaryText" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1B2730] border border-border shadow-xl p-2 z-20 space-y-1">
                    <div className="px-3 py-2 border-b border-border/60">
                      <p className="text-xs text-secondaryText">Connected Wallet</p>
                      <p className="text-xs font-mono text-mainText truncate mt-0.5" title={address}>
                        {address}
                      </p>
                    </div>

                    <a
                      href={`https://scan.botchain.ai/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-secondaryText hover:text-mainText hover:bg-[#101820] rounded-lg transition-colors"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink className="w-3 h-3 text-secondaryText" />
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-errorRed hover:bg-errorRed/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
