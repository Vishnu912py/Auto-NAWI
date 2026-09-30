# SmartNAWI • Legal Metrology Digital Platform
**Problem Statement 26035**: *Test Report Generation for Non-Automatic Weighing Instruments (NAWI) as per OIML R-76*

An end-to-end digital testing, compliance evaluation, and certification workflow platform built for the **Smart India Hackathon (SIH)**.

---

## 🚀 Quick Start

1. Start development server:
```bash
npm run dev
```

2. Open in your browser:
👉 **[http://localhost:5173/](http://localhost:5173/)**

3. Build production bundle:
```bash
npm run build
```

---

## 🛠️ Architecture & Features
- **Deterministic OIML R-76 Rule Engine**: Evaluates Maximum Permissible Error (MPE) across Accuracy Classes I, II, III, IV.
- **Interactive 4-Step Test Entry Wizard**: Weighing performance, repeatability ($\Delta E$), platter eccentricity (corner load).
- **Standardized OIML R-76-2 Certificate PDF Engine**: 1-click official PDF generation with autotables and dynamic QR code.
- **Cryptographic SHA-256 Tamper Defense**: Verifies authentic certificates and rejects post-issuance tampering.
- **Role-Based Access Control (RBAC)**: Technician, Certifying Officer, Metrology Administrator, Public Verifier.
- **SIH Pitch Companion (Pitch Mode)**: Interactive 6-slide script synced with live demo triggers.
