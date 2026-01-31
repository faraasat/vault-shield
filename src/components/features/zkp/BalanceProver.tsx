"use client";

import { useState } from "react";
// @ts-ignore
import * as snarkjs from "snarkjs";
import { StorageService } from "@/services/storage";
import { useIdentity } from "@/context/IdentityContext";

export default function BalanceProver() {
  const { identity } = useIdentity();
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
        Generate Zero Knowledge Proof
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
            className="bg-black border border-[#00ff9d] p-6 rounded relative overflow-hidden group/badge mb-4"
            style={{ backgroundColor: "#000000", borderColor: "#00ff9d" }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover/badge:opacity-40 transition-opacity">
              <div
                className="text-6xl text-[#00ff9d]"
                style={{ color: "#00ff9d" }}
              >
                ✓
              </div>
            </div>

            <h3
              className="text-[#00ff9d] font-bold uppercase tracking-widest border-b border-[#00ff9d]/30 pb-2 mb-4"
              style={{
                color: "#00ff9d",
                borderBottomColor: "rgba(0, 255, 157, 0.3)",
              }}
            >
              Solvency Verified
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono text-secondary">
              <div>
                <span className="opacity-50 block mb-1">PROVER</span>
                <span className="text-white truncate block max-w-[120px]">
                  {identity
                    ? identity.slice(0, 10) + "..." + identity.slice(-4)
                    : "ANON_USER"}
                </span>
              </div>
              <div>
                <span className="opacity-50 block mb-1">TIMESTAMP</span>
                <span className="text-white">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <div>
                <span className="opacity-50 block mb-1">PROTOCOL</span>
                <span className="text-white">GROTH16-BN128</span>
              </div>
              <div>
                <span className="opacity-50 block mb-1">STATUS</span>
                <span
                  className="text-[#00ff9d] glow"
                  style={{ color: "#00ff9d" }}
                >
                  VALID
                </span>
              </div>
            </div>

            <div
              className="bg-white/5 p-3 rounded font-mono text-[10px] text-text-muted overflow-hidden whitespace-nowrap text-ellipsis border border-white/10"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              PROOFHASH: {JSON.stringify(proof).slice(0, 60)}...
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={async () => {
                if (!proof) return;
                try {
                  const id =
                    typeof crypto?.randomUUID === "function"
                      ? crypto.randomUUID()
                      : Math.random().toString(36).substring(2, 15);

                  console.log("Saving proof to vault:", proof);
                  await StorageService.addAsset({
                    id,
                    type: "proof",
                    content: proof,
                    createdAt: Date.now(),
                  });
                  console.log("Proof saved successfully");
                  setStatus("Proof Saved to Vault!");
                  setTimeout(() => setStatus(""), 3000);
                } catch (err) {
                  console.error("Critical Save Error:", err);
                  setStatus("Save Failed: Check console for logs");
                }
              }}
              className="flex-1 py-2 border border-secondary text-secondary font-mono text-xs uppercase hover:bg-secondary/10 transition-colors"
            >
              Save to Vault
            </button>
            <button
              onClick={async () => {
                const element = document.getElementById("zk-badge");
                console.log(
                  "Download Badge clicked, element found:",
                  !!element,
                );
                if (element) {
                  try {
                    setStatus("Preparing Badge Download...");
                    console.log("Importing html2canvas...");
                    const html2canvas = (await import("html2canvas")).default;
                    console.log("Capturing element...");
                    const canvas = await html2canvas(element, {
                      backgroundColor: "#000",
                      useCORS: true,
                      scale: 2,
                      logging: true,
                      onclone: (clonedDoc) => {
                        // Crucial Fix: Standard html2canvas doesn't support oklab/oklch
                        // We must find and replace these in the cloned document's styles
                        const problematicElements =
                          clonedDoc.querySelectorAll("*");

                        // Also remove any <style> tags that might contain oklab/oklch
                        const styles = clonedDoc.querySelectorAll("style");
                        styles.forEach((s) => {
                          if (s.innerHTML.includes("okl")) {
                            s.innerHTML = s.innerHTML.replace(
                              /okl(ab|ch)\([^)]+\)/g,
                              "#000",
                            );
                          }
                        });

                        problematicElements.forEach((el) => {
                          const htmlEl = el as HTMLElement;
                          if (htmlEl.style) {
                            // Strip problematic styles
                            const style = window.getComputedStyle(htmlEl);
                            const props = [
                              "color",
                              "backgroundColor",
                              "borderColor",
                              "borderBottomColor",
                              "borderTopColor",
                              "outlineColor",
                            ];
                            props.forEach((prop) => {
                              // @ts-ignore
                              const val = style[prop];
                              if (
                                val &&
                                (val.includes("oklab") || val.includes("oklch"))
                              ) {
                                if (prop === "color")
                                  htmlEl.style.color = "#ffffff";
                                else if (prop.includes("background"))
                                  htmlEl.style.backgroundColor = "#000000";
                                else htmlEl.style.borderColor = "#00ff9d";
                              }
                            });

                            // Remove animations/transitions
                            htmlEl.style.animation = "none";
                            htmlEl.style.transition = "none";
                          }
                        });
                      },
                    });
                    console.log("Canvas generated, creating download link...");
                    const link = document.createElement("a");
                    link.download = `vault-shield-badge-${Date.now()}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                    setStatus("Badge Downloaded!");
                    setTimeout(() => setStatus(""), 3000);
                  } catch (err) {
                    console.error("Download Error:", err);
                    setStatus("Download Failed: Check console");
                  }
                } else {
                  setError("Badge element not found in DOM");
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
