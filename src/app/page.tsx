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
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}>V</div>
            <span className={styles.logoText}>VaultShield</span>
          </div>
          <nav className={styles.nav}>
            {(["dashboard", "zkp", "redact"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.navButton} ${activeTab === tab ? styles.navButtonActive : styles.navButtonInactive}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          <div className={styles.userInfo}>
            {profile ? `Welcome, ${profile.name}` : "Loading..."}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {activeTab === "dashboard" && (
          <div>
            <section className={styles.hero}>
              <h1 className={styles.heroTitle}>Privacy First. Local Always.</h1>
              <p className={styles.heroText}>
                Verify your financial status and inspect documents without ever
                sending your data to a server.
              </p>
            </section>

            <div className={styles.grid}>
              <div onClick={() => setActiveTab("zkp")} className={styles.card}>
                <h3 className={styles.cardTitle}>ZKP Badge Generator &rarr;</h3>
                <p className={styles.cardText}>
                  Generate "Proof of Minimum Balance" locally using zk-SNARKs.
                </p>
              </div>
              <div
                onClick={() => setActiveTab("redact")}
                className={styles.card}
              >
                <h3 className={styles.cardTitle}>PII Redactor &rarr;</h3>
                <p className={styles.cardText}>
                  Automatically detect and censor sensitive info from images
                  locally.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "zkp" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 className={styles.sectionTitle}>Financial Verification</h2>
            <BalanceProver />
          </div>
        )}

        {activeTab === "redact" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 className={styles.sectionTitle}>Document Privacy</h2>
            <DocumentRedactor />
          </div>
        )}
      </main>
    </div>
  );
}
