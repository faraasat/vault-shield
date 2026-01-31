# Technologies

VaultShield relies on a sophisticated stack of privacy-preserving cryptographic tools and on-device machine learning models. This document outlines the core technologies powering the application.

## Zero-Knowledge Proofs (ZKP)

The core verification layer of VaultShield is built upon Zero-Knowledge Proofs, allowing users to verify financial claims without revealing the underlying sensitive data.

- **Circom**: Used for defining the arithmetic circuits that represent our financial constraints (e.g., "Account Balance > Threhold"). Circom allows us to write these constraints in a high-level language that compiles down to the R1CS (Rank-1 Constraint System) format needed for proofs.
- **SnarkJS**: A JavaScript/WASM library that runs entirely on the client side. It generates the actual zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) and verifies them. This ensures that the proof generation process happens locally on the user's device, so raw financial data never leaves the secure enclosure.

## Artificial Intelligence & Machine Learning

VaultShield employs a multi-faceted AI approach to protect Personally Identifiable Information (PII) and orchestrate secure sharing. All models are optimized for local execution.

- **Tesseract OCR**: An open-source Optical Character Recognition engine used to extract text from screenshots, bank statements, or images of documents. This is the first step in the data ingestion pipeline, converting unstructured visual data into machine-readable text.
- **transformers (js)**: We utilize the Hugging Face ecosystem, specifically running models locally.
  - **DistilBERT**: A distrubed, lighter, and faster version of BERT (Bidirectional Encoder Representations from Transformers). This model is fine-tuned for Named Entity Recognition (NER) to identify PII such as names, addresses, and organizations within the text extracted by OCR. Its compact size makes it ideal for running directly in the browser or mobile environment without server latency or privacy risks.
- **TensorFlow Lite**: Used for running the lightweight "Orchestration" and "Anomaly Detection" models. These models learn user sharing patterns (e.g., "User typically shares Proof of Income with Landlords") and flag unusual requests. TFLite ensures these inference tasks are highly efficient and battery-friendly on mobile devices.

## Storage & Architecture

- **Local-First Architecture**: The fundamental design principle. All raw financial data, unredacted documents, and private keys reside solely on the user's device. There is no central database holding user records.
- **Web3 Storage**: Used strictly for storing **encrypted** badge metadata and references. This ensures high availability and censorship resistance for the proofs themselves, allowing third parties to verify a badge's existence and validity without accessing the issuer's servers, while the content remains opaque to the storage provider.
