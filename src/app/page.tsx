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
      <h2 className="text-3xl font-bold text-white uppercase mb-8 font-mono flex items-center gap-3">
        <span className="text-secondary">✦</span> My Vault History
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-black/80 border border-white/10 p-6 rounded group hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-center mb-4">
              <span
                className={`text-xs font-mono px-2 py-1 rounded border ${asset.type === "proof" ? "border-primary text-primary" : "border-secondary text-secondary"}`}
              >
                {asset.type.toUpperCase()}
              </span>
              <span className="text-xs text-text-muted font-mono">
                {new Date(asset.createdAt).toLocaleDateString()}
              </span>
            </div>

            {asset.type === "proof" ? (
              <div>
                <p className="text-white font-bold mb-2">Solvency Badge</p>
                <div className="text-[10px] text-text-muted break-all h-20 overflow-hidden font-mono bg-white/5 p-2 rounded">
                  {JSON.stringify(asset.content)}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-white font-bold mb-2">Redacted Document</p>
                <img
                  src={asset.content}
                  alt="Redacted"
                  className="w-full h-32 object-cover rounded opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
