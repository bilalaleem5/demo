# Exception Management Flow — What Happens If the Task Is Not Completed?

> [!IMPORTANT]
> This section addresses the gap between **"SLA attached"** and **"Closed & written back to C‑Store"** — specifically, the enforcement loop that ensures every assigned task is either completed or properly escalated.

---

## Overview

Once a task is assigned and an SLA is attached, the system does **not** assume the owner will act. Instead, it enters an **active enforcement loop** that tracks acknowledgement, reminds, escalates, and — if necessary — reassigns the task until it reaches verified closure.

### High-Level Exception Flow

```
Assigned → Awaiting Acknowledgement → Reminder → Escalation → Reassignment
    → Evidence Submission → Verification → Closure & Write-back
```

---

## Detailed Exception-Management Flow

```mermaid
flowchart TD
    A["🎯 Task Assigned\n(SLA Attached)"] --> B["📩 Acknowledgement Requested\n(Push + In-App + SMS)"]

    B --> C{{"Owner acknowledges\nwithin SLA window?"}}

    C -->|"✅ Yes"| D["✔️ Task Acknowledged\nOwner begins work"]
    C -->|"❌ No"| E["⏰ Auto-Reminder #1\nSent after configurable delay"]

    E --> F{{"Owner responds\nafter reminder?"}}
    F -->|"✅ Yes"| D
    F -->|"❌ No"| G["⚠️ Reminder #2\n(Before SLA Deadline)"]

    G --> H{{"Owner responds\nbefore SLA deadline?"}}
    H -->|"✅ Yes"| D
    H -->|"❌ No"| I["🚨 Auto-Escalation\nto Supervisor"]

    I --> J{{"Supervisor\nintervenes?"}}
    J -->|"✅ Resolves"| D
    J -->|"🔄 Reassigns"| K["🔀 Task Reassigned\nto New Owner"]
    J -->|"❌ No response"| L["⛔ SLA Breached\nStatus: OVERDUE"]

    K --> B

    L --> M["📢 Critical Alert\nto Management"]
    M --> K

    D --> N["🔧 Owner Works\non Task"]
    N --> O{{"Completed\nbefore SLA?"}}
    O -->|"✅ Yes"| P["📎 Evidence Submitted\nby Field User"]
    O -->|"❌ No"| L

    P --> Q["🔍 Evidence\nVerification"]
    Q --> R{{"Evidence\nApproved?"}}

    R -->|"✅ Approved"| S["✅ Task Closed\n& Written Back to C-Store"]
    R -->|"❌ Rejected"| T["🔄 Task Reopened\n(Reason attached)"]

    T --> N

    style A fill:#4f46e5,color:#fff,stroke:#3730a3
    style S fill:#059669,color:#fff,stroke:#047857
    style L fill:#dc2626,color:#fff,stroke:#b91c1c
    style I fill:#f59e0b,color:#000,stroke:#d97706
    style K fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style T fill:#ea580c,color:#fff,stroke:#c2410c
    style M fill:#dc2626,color:#fff,stroke:#b91c1c
```

---

## Stage-by-Stage Breakdown

### 1. Task Assigned & Acknowledgement Requested

| Detail | Value |
|---|---|
| **Trigger** | Task created and SLA attached |
| **Action** | System sends acknowledgement request via Push, In-App, and SMS |
| **Expected Response** | Owner taps "Acknowledge" within configurable window (e.g. 30 min) |
| **Data Logged** | Timestamp of assignment, channels used, delivery status |

---

### 2. Automatic Reminder (No Acknowledgement)

| Detail | Value |
|---|---|
| **Trigger** | Owner does not acknowledge within the first window |
| **Action** | System sends Reminder #1 automatically |
| **Channels** | Same channels + fallback channel if primary delivery failed |
| **Timing** | Configurable (e.g. 1 hour after assignment) |

> [!TIP]
> A second reminder is sent **before the SLA deadline** to give the owner a final opportunity to act.

---

### 3. Automatic Escalation to Supervisor

| Detail | Value |
|---|---|
| **Trigger** | Owner does not respond after Reminder #2 |
| **Action** | Task auto-escalated to the owner's supervisor |
| **Supervisor Options** | Resolve directly, reassign to another user, or flag for management |
| **Data Logged** | Escalation timestamp, supervisor notified, supervisor action taken |

---

### 4. Reassignment

| Detail | Value |
|---|---|
| **Trigger** | Supervisor reassigns, or owner is marked unavailable |
| **Action** | Task transferred to a new owner; acknowledgement loop restarts |
| **Rules** | System can auto-suggest available team members based on workload and skills |
| **Data Logged** | Reassignment reason, previous owner, new owner |

---

### 5. Overdue / SLA Breached

| Detail | Value |
|---|---|
| **Trigger** | SLA deadline passes with no completion or acknowledgement |
| **Status** | Task marked as **OVERDUE / SLA BREACHED** |
| **Action** | Critical alert sent to management; task remains active until resolved |
| **Impact** | Reflected in SLA compliance dashboards and KPI reporting |

---

### 6. Evidence Submission & Verification

| Detail | Value |
|---|---|
| **Trigger** | Owner marks task as complete |
| **Action** | Field user uploads evidence (photos, signatures, forms) |
| **Verification** | Evidence reviewed — either **Approved** or **Rejected** |
| **If Rejected** | Task **reopened** with rejection reason; owner must resubmit |
| **If Approved** | Task **closed** and written back to C‑Store |

---

## Human Approval & Manual Override

Some actions in this flow require or allow **human intervention**. The diagram below shows which steps can be automated vs. which require manual approval.

```mermaid
flowchart LR
    subgraph Automated["⚙️ Fully Automated"]
        direction TB
        R1["Reminders"]
        R2["Escalation\nNotifications"]
        R3["SLA Breach\nStatus Update"]
        R4["Notification\nRetry"]
    end

    subgraph HumanRequired["👤 Human Approval Required"]
        direction TB
        H1["Reassignment\nDecision"]
        H2["Evidence\nApproval / Rejection"]
        H3["Manual Override\nof SLA Timer"]
        H4["Force-Close\na Task"]
    end

    subgraph ManualOverride["🔧 Manual Override Available"]
        direction TB
        M1["Pause SLA\nclock temporarily"]
        M2["Override auto-\nescalation path"]
        M3["Bypass reminder\nand escalate now"]
        M4["Re-open a\nclosed task"]
    end

    style Automated fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f
    style HumanRequired fill:#fef3c7,stroke:#f59e0b,color:#78350f
    style ManualOverride fill:#ede9fe,stroke:#8b5cf6,color:#4c1d95
```

> [!WARNING]
> **Force-closing** a task or **overriding the SLA timer** are audited actions. Every manual override is logged with the operator's identity, timestamp, and justification.

---

## Failed Notification Retry Flow

When a notification fails to deliver (e.g. push not received, SMS gateway error), the system automatically retries through an alternative channel.

```mermaid
flowchart TD
    N1["📤 Send Notification\n(Primary Channel)"] --> N2{{"Delivery\nConfirmed?"}}

    N2 -->|"✅ Yes"| N3["✔️ Delivered\nLog confirmation"]
    N2 -->|"❌ No"| N4["⏳ Wait & Retry\n(Same Channel, up to 3x)"]

    N4 --> N5{{"Retry\nSuccessful?"}}
    N5 -->|"✅ Yes"| N3
    N5 -->|"❌ No"| N6["🔄 Switch to\nFallback Channel"]

    N6 --> N7["Try: SMS → Email → WhatsApp\n(Ordered by priority)"]
    N7 --> N8{{"Fallback\nDelivered?"}}

    N8 -->|"✅ Yes"| N3
    N8 -->|"❌ No"| N9["🚨 Alert Admin\nAll channels failed"]

    N9 --> N10["📋 Queued for\nManual Follow-up"]

    style N1 fill:#4f46e5,color:#fff,stroke:#3730a3
    style N3 fill:#059669,color:#fff,stroke:#047857
    style N9 fill:#dc2626,color:#fff,stroke:#b91c1c
    style N6 fill:#f59e0b,color:#000,stroke:#d97706
```

| Retry Rule | Details |
|---|---|
| **Max retries per channel** | 3 attempts with exponential backoff |
| **Fallback order** | SMS → Email → WhatsApp (configurable) |
| **All channels exhausted** | Admin alerted; task queued for manual follow-up |
| **Logging** | Every attempt logged with channel, timestamp, and status |

---

## Summary: Complete Task Lifecycle (Happy Path + Exception Path)

```mermaid
flowchart TD
    START(["📋 Task Created"]) --> SLA["📏 SLA Attached"]

    SLA --> ASSIGN["🎯 Assigned to Owner"]
    ASSIGN --> ACK{{"Acknowledged?"}}

    ACK -->|"✅"| WORK["🔧 Work in Progress"]
    ACK -->|"❌"| REMIND["⏰ Reminders"]
    REMIND --> ESC{{"Still no response?"}}
    ESC -->|"❌"| ESCALATE["🚨 Escalate / Reassign"]
    ESC -->|"✅"| WORK
    ESCALATE --> ASSIGN

    WORK --> COMPLETE{{"Completed\nin time?"}}
    COMPLETE -->|"❌"| OVERDUE["⛔ SLA Breached"]
    OVERDUE --> ESCALATE

    COMPLETE -->|"✅"| EVIDENCE["📎 Evidence Submitted"]
    EVIDENCE --> VERIFY{{"Approved?"}}

    VERIFY -->|"❌ Rejected"| REOPEN["🔄 Reopened"]
    REOPEN --> WORK

    VERIFY -->|"✅ Approved"| CLOSE["✅ Closed & Written\nBack to C-Store"]

    style START fill:#6366f1,color:#fff,stroke:#4f46e5
    style CLOSE fill:#059669,color:#fff,stroke:#047857
    style OVERDUE fill:#dc2626,color:#fff,stroke:#b91c1c
    style ESCALATE fill:#f59e0b,color:#000,stroke:#d97706
    style REOPEN fill:#ea580c,color:#fff,stroke:#c2410c
```

> [!NOTE]
> This flow ensures **no task falls through the cracks**. Every unacknowledged, stalled, or failed task is automatically escalated until a human resolves it — with full audit logging at every step.
