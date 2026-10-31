# zensar

# FraudAlert Sentinel: Indian BFSI & UPI Financial Crime Defense SOC

FraudAlert Sentinel is a real-time banking cybersecurity and anti-money laundering (AML/CFT) platform designed for the Indian banking ecosystem and NPCI Unified Payments Interface (UPI).

## Key Highlights

- **Live Interbank UPI Telemetry Stream**: Background engine generating realistic transactions every 3 to 5 seconds across 4 calibrated tiers (Everyday Spend, Elevated, Under Review, and Critical Attacks).
- **Dynamic RBI & NPCI Heuristic Engine**: Real-time evaluation against configurable policy thresholds:
  - **Whale Limit (RULE-101)**: High-value outlier detection (default: ₹2,00,000+).
  - **Rapid UPI Velocity Counter (RULE-102)**: Screens rapid swiping across a rolling 30-transaction window.
  - **Off-Hours Window (RULE-103)**: Flags nocturnal activity during the 02:00 AM – 05:00 AM IST fraud window.
  - **Foreign Geo-Hop & Hawala Proxy Check (RULE-104)**: Identifies offshore darknet relays (Dubai, Lagos, Bangkok, Kyiv, Cyprus).
  - **Restricted MCC (RULE-105)**: Categorizes illicit betting and unregulated crypto OTC transactions.
- **Organic Risk Scoring Model**: Jittered multi-factor scoring spreading scores across 5 to 99 with proximity heuristics.
- **Enterprise White Theme (Stitch Design System)**: Solid horizontal status color bars:
  - 🔴 **Red Solid Bar**: Critical Fraud Flagged / Blocked
  - 🟡 **Yellow Solid Bar**: Suspicious – Under Review
  - 🟢 **Green Solid Bar**: Verified & Safe – Cleared
- **Analyst SOC & Forensics**: 1-click PMLA Section 12 account freeze, Aadhaar OTP Re-KYC dispatch, and tamper-evident audit logs.

## Presentation & Technical Architecture

The complete 10-slide executive presentation and LaTeX source code are available in the [`presentation/`](./presentation) folder:
- [`presentation/FraudAlert_Sentinel_Architecture.pdf`](./presentation/FraudAlert_Sentinel_Architecture.pdf)
- [`presentation/FraudAlert_Sentinel_Architecture.tex`](./presentation/FraudAlert_Sentinel_Architecture.tex)
- Individual slide PNGs in [`presentation/slides_png/`](./presentation/slides_png)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Run

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

The app will be running at `http://localhost:5173`.
