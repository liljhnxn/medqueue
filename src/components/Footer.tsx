import React from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { CONTRACT_ADDRESS } from "@/config/contract";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-[#101820] text-secondaryText">
      {/* Ecosystem Section */}
      <div className="border-b border-border/60 bg-[#141E28]/60 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* BOT Chain Brand & Logo */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#1B2730] border border-tealAccent/30 flex items-center justify-center p-1.5 shadow-md shadow-tealAccent/5 shrink-0 overflow-hidden">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-mainText text-base tracking-tight">
                    BOT Chain
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-tealAccent/15 text-tealAccent text-[11px] font-medium border border-tealAccent/30">
                    Mainnet (Chain ID 677)
                  </span>
                </div>
                <p className="text-xs text-secondaryText mt-0.5">
                  High-performance, AI-optimized EVM blockchain • Native Token: BOT
                </p>
              </div>
            </div>

            {/* BOT Chain Official Links with Logo at Front */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1B2730] border border-border hover:border-tealAccent/50 text-mainText hover:text-tealAccent text-xs font-medium transition-all shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-4 h-4 object-contain rounded shrink-0"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-secondaryText" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1B2730] border border-border hover:border-tealAccent/50 text-mainText hover:text-tealAccent text-xs font-medium transition-all shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-4 h-4 object-contain rounded shrink-0"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-secondaryText" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Bottom Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mainText">MedQueue</span>
          <span>—</span>
          <span>Decentralized, privacy-first queue reservation dApp on BOT Chain.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-secondaryText">
          {CONTRACT_ADDRESS && (
            <a
              href={`https://scan.botchain.ai/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-tealAccent transition-colors font-mono"
            >
              Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
            </a>
          )}
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-secondaryText">
            <ShieldCheck className="w-3.5 h-3.5 text-successGreen" />
            Zero PII Stored
          </span>
        </div>
      </div>
    </footer>
  );
}
