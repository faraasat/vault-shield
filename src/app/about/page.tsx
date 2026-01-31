export default function About() {
  return (
    <div className="max-w-[900px] mx-auto my-16 px-8 text-text-main animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-black mb-8 text-secondary uppercase text-center drop-shadow-[0_0_20px_rgba(0,255,157,0.5)] font-mono tracking-tight">
        Mission Critical
      </h1>
      <p className="text-2xl text-primary mb-12 text-center font-light tracking-wide">
        Decentralizing Trust via Local Computation
      </p>

      <section className="bg-card/50 border border-white/10 p-10 mb-8 rounded-lg backdrop-blur-md relative overflow-hidden group hover:border-secondary transition-colors duration-300">
        <div className="absolute top-2 right-4 font-mono text-primary/20 text-3xl select-none">
          0x
        </div>
        <h2 className="text-2xl mb-4 text-white flex items-center gap-4 font-bold uppercase tracking-wider before:content-[''] before:w-1 before:h-6 before:bg-secondary before:shadow-[0_0_10px_var(--secondary)]">
          The Problem
        </h2>
        <p className="text-lg leading-relaxed text-text-muted">
          Traditional identity verification feels like a surveillance state. To
          prove you can rent an apartment or get a loan, you must upload your
          entire financial history to centralized servers. These servers are
          honeypots for hackers and potential points of failure.
        </p>
      </section>

      <section className="bg-card/50 border border-white/10 p-10 mb-8 rounded-lg backdrop-blur-md relative overflow-hidden group hover:border-secondary transition-colors duration-300">
        <div className="absolute top-2 right-4 font-mono text-primary/20 text-3xl select-none">
          01
        </div>
        <h2 className="text-2xl mb-4 text-white flex items-center gap-4 font-bold uppercase tracking-wider before:content-[''] before:w-1 before:h-6 before:bg-secondary before:shadow-[0_0_10px_var(--secondary)]">
          The Solution
        </h2>
        <p className="text-lg leading-relaxed text-text-muted">
          VaultShield utilizes{" "}
          <strong className="text-white text-shadow-glow">
            Zero-Knowledge Proofs (ZKPs)
          </strong>{" "}
          and
          <strong className="text-white text-shadow-glow">
            Client-Side Machine Learning
          </strong>{" "}
          to let you verify facts about yourself without revealing the
          underlying data. Your bank statement never leaves your device. Only
          the mathematical proof of your eligibility is shared.
        </p>
      </section>

      <section className="bg-card/50 border border-white/10 p-10 mb-8 rounded-lg backdrop-blur-md relative overflow-hidden group hover:border-secondary transition-colors duration-300">
        <div className="absolute top-2 right-4 font-mono text-primary/20 text-3xl select-none">
          10
        </div>
        <h2 className="text-2xl mb-4 text-white flex items-center gap-4 font-bold uppercase tracking-wider before:content-[''] before:w-1 before:h-6 before:bg-secondary before:shadow-[0_0_10px_var(--secondary)]">
          Local-First Architecture
        </h2>
        <p className="text-lg leading-relaxed text-text-muted">
          We believe data sovereignty is a human right. VaultShield runs
          entirely in your browser using WebAssembly. No backend database stores
          your profile. Your keys. Your data. Your proof.
        </p>
      </section>
    </div>
  );
}
