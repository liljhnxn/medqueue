import React from "react";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-[#101820] py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondaryText">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mainText">MedQueue</span>
          <span>—</span>
          <span>A simple blockchain queue demo.</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://scan.bohr.life"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-tealAccent transition-colors"
          >
            <span>Botchain Testnet Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
