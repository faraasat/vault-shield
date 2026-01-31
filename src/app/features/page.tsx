import styles from "./Features.module.css";

export default function Features() {
  const features = [
    {
      title: "Zero-Knowledge Proofs",
      desc: "Generate cryptographic proofs of solvency or age without revealing exact numbers or dates. Powered by Groth16 zk-SNARKs.",
      icon: "🔐",
    },
    {
      title: "Local-First AI",
      desc: "Run OCR and PII detection entirely in your browser using WebAssembly. No data is ever sent to a cloud API.",
      icon: "🤖",
    },
    {
      title: "Encrypted Storage",
      desc: "Your data lives in your device's IndexedDB, encrypted at rest. We provide the protocol, you provide the storage.",
      icon: "💾",
    },
    {
      title: "Financial Integrations",
      desc: "Import CSVs from major banks or take screenshots of statements. Our smart parser extracts validatable data.",
      icon: "💳",
    },
    {
      title: "Censorship Resistant",
      desc: "Badges are portable. Once generated, the proof can be verified by anyone, anywhere, regardless of our server status.",
      icon: "🛡️",
    },
    {
      title: "Bio-Digital UI",
      desc: "A futuristic interface designed for clarity and speed. Dark mode native, high contrast, and built for privacy.",
      icon: "👁️",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>System Capabilities</h1>

      <div className={styles.grid}>
        {features.map((f, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>{f.icon}</div>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardText}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
