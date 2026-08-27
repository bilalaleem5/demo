# Build a fully interactive, pixel-perfect demo CRM dashboard as a single React artifact that...

Build a fully interactive, pixel-perfect demo CRM dashboard as a single React artifact 

that simulates the complete O.N.E.Tech intelligence layer sitting on top of a retail 

execution platform called C-Store. This is for a client-facing demo at a B2B tech 

meeting — it must look production-ready, not like a prototype.

==== CONTEXT ====

C-Store is Brand Partners' internal retail execution platform used by merchandisers, 

supervisors, promoters and clients. It already captures:

- OOS (Out of Stock) / availability events

- Share of shelf data

- RTVs, expiries, damages

- Image-recognition output (structured confidence scores)

- Field agent updates (including Arabic voice notes)

O.N.E.Tech is NOT replacing C-Store. It is the intelligence/action orchestration layer 

that sits ON TOP and adds:

detect → interpret → recommend action → assign/notify → track SLA → escalate → 

confirm resolution → learn

==== WHAT TO BUILD ====

Build a dashboard with 4 panels that all animate and interact with each other in 

real-time using mock data and setInterval timers:

--- PANEL 1: LIVE EVENT FEED (Left sidebar, ~20% width) ---

Title: "C-Store Live Feed"

Show a live scrolling feed of incoming events as if arriving from C-Store webhooks.

Each event card should show:

  - Event type badge (OOS / Low Stock / Shelf Violation / Damage / Expiry)

  - SKU name (use realistic FMCG products: Pepsi 500ml, Lays Classic 50g, 

    Nescafe 3-in-1, Red Bull 250ml, Dove Soap 135g)

  - Store name (use KSA locations: Carrefour Riyadh, Panda Jeddah, 

    Lulu Dammam, HyperPanda Makkah Road, Tamimi Markets)

  - Confidence score from image recognition (e.g. 94%)

  - Time ago (2 min ago)

  - A small Arabic text snippet simulating a field agent voice note 

    (e.g. "المنتج غير متوفر في الرف")

New events should auto-appear every 4 seconds. Events should pulse/highlight 

when they appear.

--- PANEL 2: O.N.E.TECH PROCESSING PIPELINE (Center-top, ~40% width) ---

Title: "O.N.E.Tech Intelligence Layer"

Show a LIVE animated pipeline with 6 stages. When a new event is selected 

or auto-processes, animate a progress bar moving through each stage:

Stage 1 — SIGNAL INGESTION

  Show: "Receiving structured event from C-Store API"

  Data shown: event_id, store_id, sku_id, confidence_score, timestamp

Stage 2 — CONTEXT + CLASSIFICATION  

  Show: "Enriching with SKU rank, store tier, account priority"

  Data shown: SKU Rank: Top 5 | Store Tier: A | Last OOS: 3 days ago

Stage 3 — DECISION + POLICY ENGINE

  Show: "Scoring commercial impact and urgency"

  Data shown: 

    Commercial Exposure: SAR 4,200/day

    Urgency Score: 9.2/10

    Policy Match: OOS Critical Response SOP

    Decision: ESCALATE TO SUPERVISOR + RESTOCK ORDER

Stage 4 — EXECUTION + ORCHESTRATION

  Show: "Creating task in C-Store | Notifying distributor"

  Data shown: Task #ONT-2847 created | WhatsApp alert sent to Ahmed Al-Rashidi

Stage 5 — SLA TRACKING

  Show a live countdown timer: "SLA: 4h 00m remaining"

  Timer should visibly count down

  Show: Assigned to: Merchandiser L2 | Escalation Owner: Regional Supervisor

Stage 6 — CLOSURE + LEARNING

  Show: "Awaiting resolution evidence | Audit log active"

  Data shown: Status: OPEN | Evidence required: shelf image + stock confirmation

Each stage should have a status indicator: ✓ Complete / ⟳ Processing / ○ Waiting

The active stage glows with a pulsing animation.

--- PANEL 3: ACTION CRM BOARD (Center-bottom, ~40% width) ---

Title: "Active Actions — KSA Pilot Region"

Show a Kanban-style board with 4 columns:

  ASSIGNED | IN PROGRESS | AWAITING EVIDENCE | RESOLVED

Pre-populate with 8-10 realistic action cards. Each card shows:

  - Priority badge: CRITICAL / HIGH / MEDIUM (color coded red/orange/yellow)

  - SKU + Store

  - Action type: Restock | Supervisory Visit | Distributor Alert | Image Verification

  - Assigned to (field agent name in Arabic/English like "Ahmed Al-Rashidi", 

    "Sara Mohammed", "Khalid Al-Otaibi")

  - SLA countdown timer (live, counting down)

  - A small escalation indicator if SLA < 1 hour

  - WhatsApp icon showing notification sent

When a new event completes Stage 4, a new card should animate-in to the 

ASSIGNED column.

Cards should auto-move from ASSIGNED → IN PROGRESS → RESOLVED every 

15-20 seconds to simulate live field activity.

When a card hits RESOLVED, it should show a green checkmark and "Written back 

to C-Store ✓"

--- PANEL 4: KPI SUMMARY BAR (Top header, full width) ---

Show live-updating metrics:

  - Events Processed Today: (counter, incrementing)

  - Critical OOS Active: (number, changes as cards resolve)

  - Avg SLA Response Time: 1h 42m

  - Actions Auto-Assigned: 94%

  - Human Overrides Today: 3

  - Resolution Rate (Last 7 Days): 91%

  - Commercial Value Protected: SAR 847,000 (incrementing slowly)

==== DESIGN REQUIREMENTS ====

- Dark professional theme: background #0F1117, cards #1A1D2E, accent #6C63FF 

  with electric blue highlights

- Use Inter or Geist font

- All numbers animate/count up on load

- Pipeline stages should have smooth left-to-right progress animation

- Mobile-responsive is NOT required — optimize for 1440px widescreen presentation

- Add a subtle "LIVE DEMO" badge in the top-right corner

- Add a toggle button "Simulate OOS Event" that manually triggers a new event 

  through the full pipeline so the presenter can click it during the meeting

- Add a language toggle [EN / AR] that flips all store names and agent names 

  to Arabic script

==== MOCK DATA RULES ====

- All SKUs should be real FMCG brands

- All locations should be real KSA cities/stores  

- SLA times should vary: some urgent (45 min left), some comfortable (3h+)

- At least 2 cards should show ESCALATED status with red border

- One card should show "Awaiting Arabic Voice Note Transcription..."

- Financial figures in SAR

==== INTERACTION ====

- Clicking any event in Panel 1 should highlight its corresponding action 

  card in Panel 3

- Clicking any pipeline stage in Panel 2 should expand it to show more detail

- "Simulate OOS Event" button: triggers full animated flow from Panel 1 → 2 → 3

- Hovering a KPI card shows a small sparkline trend chart

Make this feel like a real, live, production system. The goal is that when 

the client sees this, they immediately visualize their own operations running 

through this system.


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
