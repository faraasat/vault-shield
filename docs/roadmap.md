# Roadmap

## Phase 1: The Privacy Sandbox (MVP)

- **Goal**: Prove the concept of Local ZKP and Browser-based AI Redaction.
- **Deliverables**:
  - Standalone Web App (React).
  - "Proof of Balance" Circuit (Circom).
  - Basic Document Redactor (OCR + Regex).
  - Local Encrypted Storage.

## Phase 2: The Smart Guardian (Beta)

- **Goal**: Enhanced AI context awareness and usability.
- **Deliverables**:
  - Integration of DistilBERT for NER (Named Entity Recognition).
  - "Smart Reveal" sharing configuration.
  - Mobile PWA support.
  - Badge Persistence: Save generated proofs for reuse (within expiration).

## Phase 3: The Ecosystem (V1.0)

- **Goal**: Full Verification & Orchestration.
- **Deliverables**:
  - **Trust Anchors**: Integration with simulated Bank APIs (or Plaid-like adapter) to verify data _source_ before generating ZKPs.
  - **Orchestration Engine**: Recommendations ("You are sharing too much") based on usage patterns.
  - **Badge Marketplace**: Library of standard proof types (Income, Consistency, Asset Class).
  - **Share via Link**: Encrypted IPFS storage for proof delivery.
