"use client";

import { useState } from "react";
// @ts-ignore
import * as snarkjs from "snarkjs";
import styles from "./BalanceProver.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.title}>ZKP Balance Prover</h2>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Current Balance</label>
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className={styles.input}
          placeholder="e.g. 5000"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Minimum Threshold</label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className={styles.input}
          placeholder="e.g. 1000"
        />
      </div>

      <button
        onClick={generateProof}
        disabled={!balance || !threshold}
        className={styles.button}
      >
        Generate Proof
      </button>

      {status && (
        <div
          className={`${styles.status} ${error ? styles.error : styles.success}`}
        >
          <strong>{status}</strong>
          {error && <p style={{ marginTop: "0.5rem" }}>{error}</p>}
        </div>
      )}

      {proof && (
        <div className={styles.proof}>
          <h3>Proof Data:</h3>
          <pre>{JSON.stringify(proof, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
