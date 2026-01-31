"use client";

import { useState, useEffect } from "react";
import BalanceProver from "@/components/features/zkp/BalanceProver";
import DocumentRedactor from "@/components/features/redaction/DocumentRedactor";
import { StorageService } from "@/services/storage";

export default function Home() {
  return (
    <main className="min-h-screen p-8 text-text-main animate-fade-in relative z-10">
      <header className="max-w-[1400px] mx-auto mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
          <span className="text-white">Vault</span>
          <span className="text-primary">Shield</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-muted font-light tracking-wide max-w-2xl mx-auto">
          Zero-Knowledge Identity & Financial Verification Enclave
        </p>
      </header>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <section className="backdrop-blur-sm bg-black/20 rounded-xl">
          <BalanceProver />
        </section>

        <section className="backdrop-blur-sm bg-black/20 rounded-xl">
          <DocumentRedactor />
        </section>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <VaultHistory />
      </div>
    </main>
  );
}

function VaultHistory() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    StorageService.getAssets().then(setAssets);
  }, []);

  if (assets.length === 0) return null;

  return (
    <div className="border-t border-white/10 pt-12">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-white uppercase font-mono flex items-center gap-3">
          <span className="text-secondary animate-pulse">✦</span> My Vault
          History
        </h2>
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest border-b border-text-muted/30 pb-1">
          {assets.length} ASSETS_STORED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-black/80 border border-white/10 p-6 rounded-lg group hover:border-primary/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
          >
            {/* Background Accent */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 blur-3xl opacity-10 transition-opacity group-hover:opacity-30 ${asset.type === "proof" ? "bg-primary" : "bg-secondary"}`}
            />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-tighter ${
                  asset.type === "proof"
                    ? "border-primary/40 text-primary bg-primary/5"
                    : "border-secondary/40 text-secondary bg-secondary/5"
                }`}
              >
                {asset.type === "proof"
                  ? "ZK_SOLVENCY_PROOF"
                  : "REDACTED_DOCUMENT"}
              </span>
              <span className="text-[10px] text-text-muted font-mono bg-white/5 px-2 py-0.5 rounded">
                {new Date(asset.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex-grow flex flex-col relative z-10">
              {asset.type === "proof" ? (
                <div className="flex flex-col h-full">
                  <p className="text-sm text-white font-mono mb-4 flex items-center gap-2">
                    <span className="text-primary tracking-tighter">&gt;</span>{" "}
                    PROOF_DATA
                  </p>
                  <div className="text-[9px] text-text-muted break-all h-24 overflow-hidden font-mono bg-white/5 p-3 rounded border border-white/5 flex-grow">
                    {JSON.stringify(asset.content)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <p className="text-sm text-white font-mono mb-4 flex items-center gap-2">
                    <span className="text-secondary tracking-tighter">
                      &gt;
                    </span>{" "}
                    PRIVACY_ENHANCED_IMG
                  </p>
                  <div className="relative rounded overflow-hidden border border-white/10 flex-grow bg-black group-hover:border-secondary/30 transition-colors">
                    <img
                      src={asset.content}
                      alt="Redacted"
                      className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 pointer-events-none border-[10px] border-black/20" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[9px] font-mono text-text-muted truncate max-w-[120px]">
                UID_{asset.id.slice(0, 8)}
              </span>
              <button className="text-[10px] text-primary hover:text-white font-mono uppercase tracking-widest flex items-center gap-1 transition-colors">
                Details <span className="text-[14px]">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
