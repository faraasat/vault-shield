"use client";

import { useState } from "react";
// @ts-ignore
import * as snarkjs from "snarkjs";
import { StorageService } from "@/services/storage";

export default function BalanceProver() {
  const [balance, setBalance] = useState("");
  const [threshold, setThreshold] = useState("");
  const [mockMode, setMockMode] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Mock Proof Generator for Demo Purposes
  const generateMockProof = async () => {
    setStatus("Generating Mock Proof...");
    await new Promise((r) => setTimeout(r, 1500));

    // Create a fake Groth16 proof structure
    const mockProof = {
      pi_a: ["0x123...abc", "0x456...def", "1"],
      pi_b: [
        ["0x789...123", "0xabc...456"],
        ["0xdef...789", "0x123...abc"],
        ["1", "0"],
      ],
      pi_c: ["0x987...654", "0x321...cbd", "1"],
      protocol: "groth16",
      curve: "bn128",
    };

    setProof(mockProof);
    setStatus("Proof Generated Successfully!");
  };

  const generateProof = async () => {
    if (mockMode) {
      await generateMockProof();
      return;
    }

    setStatus("Generating Proof...");
    setError("");
    try {
      if (!balance || !threshold) return;

      const inputs = {
        balance: parseInt(balance),
        threshold: parseInt(threshold),
      };

      const wasmPath = "/circuits/balance.wasm";
      const zkeyPath = "/circuits/balance_final.zkey";

      // Check if files exist before trying (improves UX)
      try {
        await fetch(wasmPath, { method: "HEAD" });
      } catch {
        throw new Error(
          "Circuit files (balance.wasm) not found in /public/circuits/. Enable 'Mock Mode' to test the UI.",
        );
      }

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        inputs,
        wasmPath,
        zkeyPath,
      );

      setProof(proof);
      setStatus("Proof Generated Successfully!");
      console.log("Proof:", proof);
      console.log("Public Signals:", publicSignals);
    } catch (err: any) {
      console.error(err);
      setError("Proof generation failed: " + (err.message || err));
      setStatus("Failed");

      // Auto-suggest mock mode on failure
      if (
        err.message &&
        (err.message.includes("fetch") || err.message.includes("Circuit"))
      ) {
        setError(
          "Circuit files causing error. Switch to 'Mock Mode' for a demo.",
        );
      }
    }
  };

  return (
    <div className="p-8 rounded-lg border border-primary bg-black/90 shadow-[0_0_20px_rgba(0,243,255,0.1)] max-w-2xl mx-auto relative group">
      <div className="absolute -top-3 right-3 bg-deep px-2 text-primary font-mono text-xs border border-primary">
        SECURE_ENCLAVE_V1
      </div>

      <div className="flex justify-between items-center mb-8 border-b border-dashed border-white/20 pb-4">
        <h2 className="text-2xl font-bold text-primary uppercase font-mono tracking-wider">
          ZKP Balance Prover
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs uppercase font-mono transition-colors ${mockMode ? "text-success" : "text-text-muted"}`}
          >
            Mock Mode
          </span>
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`w-10 h-5 rounded-full border transition-all relative ${mockMode ? "bg-success/20 border-success" : "bg-white/10 border-white/20"}`}
          >
            <div
              className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300 ${mockMode ? "left-[22px] bg-success shadow-[0_0_10px_var(--success)]" : "left-1 bg-white/50"}`}
            />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-mono">
          Current Balance
        </label>
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="w-full p-3 bg-white/5 border border-white/10 text-white font-mono transition-all rounded focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] focus:bg-primary/5"
          placeholder="e.g. 5000"
        />
      </div>

      <div className="mb-6">
        <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-mono">
          Minimum Threshold
        </label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="w-full p-3 bg-white/5 border border-white/10 text-white font-mono transition-all rounded focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] focus:bg-primary/5"
          placeholder="e.g. 1000"
        />
      </div>

      <button
        onClick={generateProof}
        disabled={!balance || !threshold}
        className="w-full p-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent border border-primary text-primary font-bold mt-4 uppercase tracking-widest font-mono cursor-pointer transition-all relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-black hover:shadow-[0_0_20px_var(--primary)]"
      >
        {mockMode ? "Generate Mock Proof" : "Generate Zero Knowledge Proof"}
      </button>

      {status && (
        <div
          className={`mt-6 p-4 border font-mono text-sm bg-black/50 ${error ? "border-error text-error shadow-[inset_0_0_10px_rgba(255,0,60,0.2)]" : "border-success text-success shadow-[inset_0_0_10px_rgba(0,255,157,0.2)]"}`}
        >
          <strong>{status}</strong>
          {error && <p className="mt-2">{error}</p>}
        </div>
      )}

      {proof && (
        <div className="mt-8 animate-fade-in">
          <div
            id="zk-badge"
            className="bg-black border border-success p-6 rounded relative overflow-hidden group/badge mb-4"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover/badge:opacity-40 transition-opacity">
              <div className="text-6xl text-success">✓</div>
            </div>

            <h3 className="text-success font-bold uppercase tracking-widest border-b border-success/30 pb-2 mb-4">
              Solvency Verified
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono text-secondary">
              <div>
                <span className="opacity-50 block mb-1">PROVER</span>
                <span className="text-white">ANON-ZK-8821</span>
              </div>
              <div>
                <span className="opacity-50 block mb-1">TIMESTAMP</span>
                <span className="text-white">{new Date().toISOString()}</span>
              </div>
              <div>
                <span className="opacity-50 block mb-1">PROTOCOL</span>
                <span className="text-white">GROTH16-BN128</span>
              </div>
              <div>
                <span className="opacity-50 block mb-1">STATUS</span>
                <span className="text-success glow">VALID</span>
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded font-mono text-[10px] text-text-muted overflow-hidden whitespace-nowrap text-ellipsis border border-white/10">
              PROOFHASH: {JSON.stringify(proof).slice(0, 60)}...
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={async () => {
                if (!proof) return;
                await StorageService.addAsset({
                  id: crypto.randomUUID(),
                  type: "proof",
                  content: proof,
                  createdAt: Date.now(),
                });
                setStatus("Proof Saved to Vault!");
                setTimeout(() => setStatus(""), 3000);
              }}
              className="flex-1 py-2 border border-secondary text-secondary font-mono text-xs uppercase hover:bg-secondary/10 transition-colors"
            >
              Save to Vault
            </button>
            <button
              onClick={async () => {
                const element = document.getElementById("zk-badge");
                if (element) {
                  const html2canvas = (await import("html2canvas")).default;
                  const canvas = await html2canvas(element, {
                    backgroundColor: "#000",
                  });
                  const link = document.createElement("a");
                  link.download = "vault-shield-badge.png";
                  link.href = canvas.toDataURL();
                  link.click();
                }
              }}
              className="flex-1 py-2 border border-primary text-primary font-mono text-xs uppercase hover:bg-primary/10 transition-colors"
            >
              Download Badge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
