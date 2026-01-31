"use client";

import { useState } from "react";
// @ts-ignore
import * as snarkjs from "snarkjs";

export default function BalanceProver() {
  const [balance, setBalance] = useState("");
  const [threshold, setThreshold] = useState("");
  const [proof, setProof] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const generateProof = async () => {
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

      if (err.message && err.message.includes("fetch")) {
        setError(
          "Circuit files not found. Please compile circuits and place them in public/circuits/.",
        );
      }
    }
  };

  return (
    <div className="p-8 rounded-lg border border-primary bg-black/90 shadow-[0_0_20px_rgba(0,243,255,0.1)] max-w-2xl mx-auto relative group">
      <div className="absolute -top-3 right-3 bg-deep px-2 text-primary font-mono text-xs border border-primary">
        SECURE_ENCLAVE_V1
      </div>

      <h2 className="text-2xl font-bold mb-8 text-primary uppercase border-b border-dashed border-white/20 pb-4 font-mono tracking-wider">
        ZKP Balance Prover
      </h2>

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
        Generate Proof
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
        <div className="mt-6 p-4 bg-black border border-white/10 text-success font-mono text-xs overflow-x-auto max-h-[200px] rounded">
          <h3 className="mb-2 font-bold opacity-70">Proof Data:</h3>
          <pre>{JSON.stringify(proof, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
