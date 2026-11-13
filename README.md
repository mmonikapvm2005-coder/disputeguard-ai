# 🛡️ DisputeGuard AI
### Autonomous PayPal Dispute Defense & Forensic Evidence Agent
*Built for the **PayPal & AI: Build What's Next Global Hackathon 2026***  
*Eligible Sponsor Tracks: **PayPal Platform**, **AG Grid***

🌐 **Live Production Demo:** [https://disputeguard-ai.vercel.app](https://disputeguard-ai.vercel.app)  
📦 **Source Code Repository:** [https://github.com/mmonikapvm2005-coder/disputeguard-ai](https://github.com/mmonikapvm2005-coder/disputeguard-ai)

---

## 💡 Inspiration
Every day, PayPal moves money for millions of merchants and consumers across the globe. However, chargebacks and disputes (*Item Not Received*, *Unauthorized Payment*, *Significantly Not As Described*) cost global merchants over **$100 Billion** annually in lost revenue, fees, and operational drag.

Merchants often possess all the evidence required under **PayPal Seller Protection** (carrier delivery scans, GPS coordinates, signature proof, 3D-Secure logs, product listing specs), but compiling this evidence within PayPal's strict response deadlines is slow and manual. As a result, merchants forfeit winnable claims.

**DisputeGuard AI** puts AI behind the wheel of PayPal's Disputes and Tracking ecosystem to autonomously audit claims, calculate win probabilities, synthesize legal defense dossiers, and submit evidence directly via PayPal APIs.

---

## ⚡ What It Does

1. **Live PayPal Disputes War Room (Powered by AG Grid):**
   - High-performance grid displaying active disputes, claims, amounts, urgency timers, and win probability gauges.
   - Built on **AG Grid** for virtualization, multi-column sorting, and real-time status filtering.

2. **AI Forensic Engine & Seller Protection Auditor:**
   - Evaluates claims against PayPal's official Seller Protection criteria.
   - Cross-references carrier tracking (FedEx, UPS, DHL, USPS), delivery scans, confirmed shipping addresses, and 3D Secure / CVV authentication logs.
   - Outputs a quantitative **Win Probability Score (%)** and an automated verification checklist.

3. **Autonomous Defense Dossier Generation:**
   - Synthesizes formal, legally sound defense submissions formatted directly for PayPal's adjudication teams and API endpoints (`/v1/customer/disputes/{dispute_id}/provide-evidence`).

4. **Dual Operating Modes:**
   - **Co-Pilot Mode:** The merchant reviews the AI's evidence checklist and clicks **"Submit Defense to PayPal (Sandbox)"** in 1 click.
   - **Auto-Pilot Mode:** The autonomous agent sweeps pending disputes and automatically submits defenses for claims meeting configurable confidence thresholds (e.g. Win Confidence $\ge 85\%$ and Amount $\le \$250$).

5. **Instant Webhook & Simulation Sandbox:**
   - Test incoming `CUSTOMER_DISPUTE_CREATED` webhook events with 1 click to demonstrate live agent reaction.

---

## 🏗️ Architecture & PayPal Tech Stack

```
   ┌──────────────────────────────────────────────────────────────┐
   │                    Merchant Dashboard UI                     │
   │      (Next.js App Router + Tailwind CSS + Lucide Icons)      │
   └───────────────▲──────────────────────────────▲───────────────┘
                   │                              │
     AG Grid Enterprise Virtualization     Inspection Drawer
                   │                              │
   ┌───────────────▼──────────────────────────────▼───────────────┐
   │               DisputeGuard AI Core Engine                    │
   │    • Forensic Verification Agent                             │
   │    • Seller Protection Protocol Analyzer                     │
   │    • Auto-Pilot Adjudication Daemon                          │
   └───────────────▲──────────────────────────────▲───────────────┘
                   │                              │
     REST API Protocol              Dispute Evidence Packet
                   │                              │
   ┌───────────────▼──────────────────────────────▼───────────────┐
   │                 PayPal Platform (Sandbox)                    │
   │  • /v1/oauth2/token               • /v1/customer/disputes    │
   │  • /provide-evidence              • Webhook Events           │
   └──────────────────────────────────────────────────────────────┘
```

### PayPal Technologies Utilized:
- **PayPal Disputes API (`/v1/customer/disputes`):** Ingests disputes, dispute amounts, reasons, life cycle stages, and buyer claims.
- **PayPal Evidence Submission API (`/v1/customer/disputes/{id}/provide-evidence`):** Dispatches compiled defense statements and tracking proofs.
- **PayPal Seller Protection Standards:** Programmatic verification of delivery scans to confirmed addresses.
- **PayPal Webhooks:** Schema support for `CUSTOMER_DISPUTE_CREATED` and `CUSTOMER_DISPUTE_RESOLVED`.

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Node.js v18+ installed

### 1. Installation
\`\`\`bash
npm install
\`\`\`

### 2. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

*(Optional)* To connect your live PayPal Developer Sandbox credentials, duplicate `.env.example` as `.env.local` and add your `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`. Without credentials, the app runs out-of-the-box in high-fidelity Simulator Mode.

---

## 🎬 3-Minute Video Demo Script (For Devpost Submission)

- **0:00 - 0:30 (The Hook & Pain Point):**  
  *"Merchants lose over \$100B each year to chargebacks and friendly fraud. Even when merchants ship the right items on time, compiling evidence to win a PayPal dispute takes hours. Today, we built DisputeGuard AI to solve this."*
- **0:30 - 1:15 (The War Room & AG Grid):**  
  *Show the dashboard. "Here is the Disputes War Room built with AG Grid. It streams real-time PayPal disputes, tracks capital at risk, and displays real-time AI win probabilities."*
- **1:15 - 2:00 (The AI Forensic Agent & Dossier):**  
  *Click on an "Item Not Received" dispute. "When we inspect with AI, our agent audits the FedEx tracking scan against PayPal Seller Protection criteria. It verifies the confirmed address match, notes signature proof, and writes a formal PayPal evidence dossier."*
- **2:00 - 2:30 (1-Click Submission & Auto-Pilot):**  
  *Click "Submit Defense to PayPal". "In one click, the evidence packet is sent directly to PayPal's /provide-evidence API. With Auto-Pilot enabled, claims with 90%+ win rate are defended automatically with zero human effort."*
- **2:30 - 3:00 (Closing & Vision):**  
  *"DisputeGuard AI transforms merchant risk management into an automated, AI-driven profit protector. Built for PayPal, powered by AG Grid."*

---

## 🏆 Hackathon Tracks Targeted
1. **Build What's Next with PayPal and AI (Grand Prize / Overall)**
2. **AG Grid Sponsor Prize Track (Best Enterprise Data Grid Implementation)**
