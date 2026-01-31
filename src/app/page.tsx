"use client";

import { useState, useEffect } from "react";
import BalanceProver from "@/components/features/zkp/BalanceProver";
import DocumentRedactor from "@/components/features/redaction/DocumentRedactor";
import { StorageService } from "@/services/storage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "zkp" | "redact">(
    "dashboard",
  );
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    StorageService.getProfile().then((p) => {
      if (!p) {
        StorageService.saveProfile({ name: "New User" }).then(setProfile);
      } else {
        setProfile(p);
      }
    });
  }, []);

  return (
    <main className="min-h-screen">
      {activeTab === "dashboard" && (
        <div>
          <section className="text-center py-32 px-4 relative max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6 text-white uppercase tracking-tighter bg-gradient-to-br from-white via-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,243,255,0.3)]">
              Privacy First.
              <br />
              Local Always.
            </h1>
            <p className="text-2xl text-text-muted max-w-2xl mx-auto font-light">
              Verify your financial status and inspect documents without ever
              sending your data to a server.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 mb-20">
            <div
              onClick={() => setActiveTab("zkp")}
              className="bg-card border border-white/10 rounded-xl p-10 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] backdrop-blur-md relative overflow-hidden group"
            >
              <h3 className="text-2xl font-bold mb-4 text-white font-mono flex justify-between items-center group-hover:text-primary transition-colors">
                ZKP Badge Generator{" "}
                <span className="group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </h3>
              <p className="text-text-muted leading-relaxed">
                Generate "Proof of Minimum Balance" locally using zk-SNARKs.
              </p>
            </div>
            <div
              onClick={() => setActiveTab("redact")}
              className="bg-card border border-white/10 rounded-xl p-10 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] backdrop-blur-md relative overflow-hidden group"
            >
              <h3 className="text-2xl font-bold mb-4 text-white font-mono flex justify-between items-center group-hover:text-primary transition-colors">
                PII Redactor{" "}
                <span className="group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </h3>
              <p className="text-text-muted leading-relaxed">
                Automatically detect and censor sensitive info from images
                locally.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "dashboard" && (
        <div className="max-w-5xl mx-auto py-12 px-6 animate-fade-in">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="mb-8 bg-transparent border border-white/10 px-4 py-2 text-text-muted cursor-pointer font-mono text-sm hover:border-primary hover:text-primary transition-all rounded"
          >
            ← Back to Dashboard
          </button>

          {activeTab === "zkp" && (
            <div>
              <h2 className="text-3xl mb-8 text-secondary font-mono flex items-center gap-4">
                <span className="text-primary">&gt;</span> Financial
                Verification
              </h2>
              <BalanceProver />
            </div>
          )}

          {activeTab === "redact" && (
            <div>
              <h2 className="text-3xl mb-8 text-secondary font-mono flex items-center gap-4">
                <span className="text-primary">&gt;</span> Document Privacy
              </h2>
              <DocumentRedactor />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
