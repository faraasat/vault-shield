import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mission Critical</h1>
      <p className={styles.subtitle}>
        Decentralizing Trust via Local Computation
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>The Problem</h2>
        <p className={styles.text}>
          Traditional identity verification feels like a surveillance state. To
          prove you can rent an apartment or get a loan, you must upload your
          entire financial history to centralized servers. These servers are
          honeypots for hackers and potential points of failure.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>The Solution</h2>
        <p className={styles.text}>
          VaultShield utilizes <strong>Zero-Knowledge Proofs (ZKPs)</strong> and
          <strong>Client-Side Machine Learning</strong> to let you verify facts
          about yourself without revealing the underlying data. Your bank
          statement never leaves your device. Only the mathematical proof of
          your eligibility is shared.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Local-First Architecture</h2>
        <p className={styles.text}>
          We believe data sovereignty is a human right. VaultShield runs
          entirely in your browser using WebAssembly. No backend database stores
          your profile. Your keys. Your data. Your proof.
        </p>
      </section>
    </div>
  );
}
