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
    <div className="max-w-[1200px] mx-auto my-16 px-8 animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-black text-center mb-16 text-white uppercase tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        System Capabilities
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-black/80 border border-white/10 p-8 rounded-xl relative transition-all duration-300 backdrop-blur-sm hover:-translate-y-2 hover:border-primary hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] group overflow-hidden"
          >
            {/* Hover bar effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />

            <div className="text-4xl mb-6 text-secondary drop-shadow-[0_0_10px_rgba(0,255,157,0.5)] group-hover:scale-110 transition-transform duration-300 inline-block">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 font-mono uppercase tracking-wide group-hover:text-primary transition-colors">
              {f.title}
            </h3>
            <p className="text-text-muted leading-relaxed text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
