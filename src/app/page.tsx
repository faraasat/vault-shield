"use client";

import { useState, useEffect } from "react";
import BalanceProver from "@/components/features/zkp/BalanceProver";
import DocumentRedactor from "@/components/features/redaction/DocumentRedactor";
import { StorageService } from "@/services/storage";
import styles from "./Home.module.css";

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
    <main className={styles.page}>
      {activeTab === "dashboard" && (
        <div>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>
              Privacy First.
              <br />
              Local Always.
            </h1>
            <p className={styles.heroText}>
              Verify your financial status and inspect documents without ever
              sending your data to a server.
            </p>
          </section>

          <div className={styles.grid}>
            <div onClick={() => setActiveTab("zkp")} className={styles.card}>
              <h3 className={styles.cardTitle}>
                ZKP Badge Generator <span>→</span>
              </h3>
              <p className={styles.cardText}>
                Generate "Proof of Minimum Balance" locally using zk-SNARKs.
              </p>
            </div>
            <div onClick={() => setActiveTab("redact")} className={styles.card}>
              <h3 className={styles.cardTitle}>
                PII Redactor <span>→</span>
              </h3>
              <p className={styles.cardText}>
                Automatically detect and censor sensitive info from images
                locally.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "dashboard" && (
        <div className={styles.toolContainer}>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={styles.backButton}
          >
            ← Back to Dashboard
          </button>

          {activeTab === "zkp" && (
            <div>
              <h2 className={styles.sectionTitle}>Financial Verification</h2>
              <BalanceProver />
            </div>
          )}

          {activeTab === "redact" && (
            <div>
              <h2 className={styles.sectionTitle}>Document Privacy</h2>
              <DocumentRedactor />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
