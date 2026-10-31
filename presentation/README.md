# FraudAlert Sentinel — Architecture & System Presentation

This directory contains the executive presentation and technical architecture slides for **FraudAlert Sentinel** (Challenge 06 — Indian BFSI & UPI Financial Crime Defense SOC).

## File Directory

- `FraudAlert_Sentinel_Architecture.pdf`: Ready-to-present 10-slide widescreen PDF.
- `FraudAlert_Sentinel_Architecture.tex`: LaTeX Beamer source code with vector TikZ diagrams.
- `slides_png/`: High-resolution PNG exports (180 DPI) of each individual slide (Slide 1 to 10).

## Slide Structure

1. **Title Slide**: Project overview, team attribution, and regulatory frameworks (RBI / NPCI / PMLA).
2. **Executive Overview**: High-velocity UPI threat context and tri-color triage standard.
3. **End-to-End System Architecture (TikZ)**: 4-tier processing pipeline (Ingestion -> Rule Engine -> Scoring & Triage -> SOC Actions).
4. **Real-Time Streaming Engine**: 3–5s asynchronous loop and calibrated 4-tier distribution.
5. **Dynamic Scoring Model & Rule Matrix**: Multi-factor scoring formula, jitter distribution, and active RBI rules.
6. **Transaction Lifecycle Flowchart (TikZ)**: Widescreen horizontal processing pipeline with branching triage gate.
7. **Operational Scenarios (Live Walkthrough)**:
   - *Scenario A*: Everyday Swiggy payment (Score 9/100 -> Cleared Green)
   - *Scenario B*: Rapid UPI velocity smurfing (Score 52/100 -> Under Review Yellow)
   - *Scenario C*: Offshore Crypto Hawala wire (Score 99/100 -> Flagged Fraud Red)
8. **SOC Analyst Interface**: Stitch Design System tokens and forensic drill-down capabilities.
9. **Technical Architecture & Stack**: React 18, Vite ESM, Context API + Ref synchronization, and persistence.
10. **Operational Impact & Summary**: Business outcomes and next-generation roadmap.

## Recompiling the Presentation

To recompile locally using `pdflatex`:
```bash
pdflatex -interaction=nonstopmode FraudAlert_Sentinel_Architecture.tex
```

Or copy the contents of `FraudAlert_Sentinel_Architecture.tex` directly into [Overleaf](https://www.overleaf.com) and compile with the standard pdfLaTeX engine.
