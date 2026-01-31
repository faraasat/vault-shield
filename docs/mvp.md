# Minimum Viable Product (MVP)

The specific scope for the initial release of VaultShield.

## Core Features

### 1. Basic ZKP Financial Badge

- **Feature**: Ability to generate a single type of proof: "Proof of Minimum Balance."
- **Input**: Manual entry of balance (for prototype) or CSV import from major bank.
- **Tech**: Circom circuit checking `balance >= threshold`. SnarkJS to generate proof in browser.
- **Output**: A shareable link containing the proof constant that a third party can verify on a simple web interface.

### 2. Local PII Redaction Tool

- **Feature**: Drag-and-drop document sanitizer.
- **Capabilities**:
  - OCR (Tesseract) to read uploaded image/PDF.
  - Regex-based detection for Credit Card numbers and Email addresses (Simple AI placeholder).
  - Manual selection tool for user to highlight areas to redact.
- **Output**: Flattened PDF/Image with black-box redaction burned in.

### 3. Local-First Storage

- **Feature**: Secure encrypted storage of user profile.
- **Tech**: IndexedDB wrapper.
- **Security**: Data encrypted at rest using a user-derived passphrase.

### 4. Simple UI

- **Dashboard**: View current "Verified Assets" (based on manual/CSV import).
- **Share**: Button to generate a "Minimum Balance Link."
