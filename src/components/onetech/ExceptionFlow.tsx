import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BellRing,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  RotateCcw,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import type { DemoEvent, Lang } from "@/lib/onetech/data";

/* ─── helpers ────────────────────────────────────────────────── */

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/30 py-1.5 last:border-0">
      <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k}</span>
      <span className={`text-right text-[11.5px] font-semibold leading-tight ${tone ?? "text-foreground"}`}>{v}</span>
    </div>
  );
}

/* ─── exception flow steps ───────────────────────────────────── */

interface ExceptionStep {
  key: string;
  icon: React.ReactNode;
  title: { en: string; ar: string };
  summary: { en: string; ar: string };
  tone: string;
  iconBg: string;
  details: { k: string; v: string; tone?: string }[];
}

function stepsFor(e: DemoEvent): ExceptionStep[] {
  return [
    {
      key: "assign_ack",
      icon: <Send className="h-3.5 w-3.5" />,
      title: { en: "Task assigned & acknowledgement requested", ar: "إسناد المهمة وطلب الإقرار" },
      summary: {
        en: `${e.output.taskRef} assigned to ${e.output.owner.en} — acknowledgement requested via Push, In-App & SMS`,
        ar: `${e.output.taskRef} أُسندت إلى ${e.output.owner.ar} — طُلب الإقرار عبر الإشعارات والتطبيق والرسائل`,
      },
      tone: "border-brand/50 bg-brand/10",
      iconBg: "bg-brand/20 text-brand",
      details: [
        { k: "Trigger", v: "Task created + SLA attached" },
        { k: "Channels", v: "Push + In-App + SMS" },
        { k: "Window", v: "30 minutes to acknowledge" },
        { k: "Logged", v: "Assignment timestamp, channels, delivery status" },
      ],
    },
    {
      key: "reminder_1",
      icon: <Bell className="h-3.5 w-3.5" />,
      title: { en: "Auto-reminder #1 (no acknowledgement)", ar: "تذكير تلقائي #١ (بدون إقرار)" },
      summary: {
        en: "Owner did not acknowledge within 30 min — system sends automatic reminder",
        ar: "المسؤول لم يُقر خلال ٣٠ دقيقة — النظام يرسل تذكيرًا تلقائيًا",
      },
      tone: "border-amber/50 bg-amber/8",
      iconBg: "bg-amber/20 text-amber",
      details: [
        { k: "Trigger", v: "No acknowledgement after 30 min" },
        { k: "Action", v: "Reminder sent on same + fallback channels" },
        { k: "Timing", v: "1 hour after assignment (configurable)" },
      ],
    },
    {
      key: "reminder_2",
      icon: <BellRing className="h-3.5 w-3.5" />,
      title: { en: "Reminder #2 (before SLA deadline)", ar: "تذكير #٢ (قبل موعد الاتفاقية)" },
      summary: {
        en: `Final reminder sent before ${e.output.slaLabel} SLA deadline expires`,
        ar: `تذكير أخير قبل انتهاء مهلة الاتفاقية ${e.output.slaLabel}`,
      },
      tone: "border-amber/50 bg-amber/8",
      iconBg: "bg-amber/20 text-amber",
      details: [
        { k: "Trigger", v: "No response after Reminder #1" },
        { k: "Timing", v: `Sent 1 hour before ${e.output.slaLabel} deadline` },
        { k: "Channels", v: "All available channels (Push + SMS + WhatsApp)" },
      ],
    },
    {
      key: "escalation",
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
      title: { en: "Auto-escalation to supervisor", ar: "تصعيد تلقائي للمشرف" },
      summary: {
        en: `No response after both reminders — task escalated to supervisor. ${e.output.escalation.en}`,
        ar: `لا استجابة بعد التذكيرين — تصعيد المهمة للمشرف. ${e.output.escalation.ar}`,
      },
      tone: "border-critical/50 bg-critical/8",
      iconBg: "bg-critical/20 text-critical",
      details: [
        { k: "Trigger", v: "No response after Reminder #2" },
        { k: "Escalated to", v: "Regional Supervisor" },
        { k: "Options", v: "Resolve directly, reassign, or flag for management" },
        { k: "Logged", v: "Escalation timestamp, supervisor action" },
      ],
    },
    {
      key: "reassign",
      icon: <UserPlus className="h-3.5 w-3.5" />,
      title: { en: "Reassignment (owner unavailable)", ar: "إعادة إسناد (المسؤول غير متاح)" },
      summary: {
        en: "Supervisor reassigns task to next-best available team member — acknowledgement loop restarts",
        ar: "المشرف يعيد إسناد المهمة لعضو آخر متاح — دورة الإقرار تبدأ مجددًا",
      },
      tone: "border-[oklch(0.7_0.15_280)]/50 bg-[oklch(0.7_0.15_280)]/8",
      iconBg: "bg-[oklch(0.7_0.15_280)]/20 text-[oklch(0.7_0.15_280)]",
      details: [
        { k: "Trigger", v: "Supervisor decides to reassign" },
        { k: "Selection", v: "Auto-suggest based on workload, proximity & skills" },
        { k: "Effect", v: "New owner receives fresh acknowledgement request" },
        { k: "Logged", v: "Reassignment reason, previous owner, new owner" },
      ],
    },
    {
      key: "sla_breach",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      title: { en: "Overdue / SLA breached", ar: "تأخير / خرق الاتفاقية" },
      summary: {
        en: `SLA ${e.output.slaLabel} deadline passed — task marked OVERDUE, critical alert to management`,
        ar: `تجاوز مهلة الاتفاقية ${e.output.slaLabel} — المهمة متأخرة، تنبيه حرج للإدارة`,
      },
      tone: "border-critical/60 bg-critical/10",
      iconBg: "bg-critical/25 text-critical",
      details: [
        { k: "Status", v: "OVERDUE / SLA BREACHED", tone: "text-critical" },
        { k: "Alert", v: "Critical notification to management" },
        { k: "Impact", v: "Reflected in SLA compliance dashboards & KPIs" },
        { k: "Task remains", v: "Active until resolved" },
      ],
    },
    {
      key: "evidence",
      icon: <Camera className="h-3.5 w-3.5" />,
      title: { en: "Evidence submitted by field user", ar: "الإثبات مقدم من المندوب الميداني" },
      summary: {
        en: "Owner completes task and uploads evidence — shelf photo, stock count, signature",
        ar: "المسؤول يكمل المهمة ويرفع الإثبات — صورة الرف، الجرد، التوقيع",
      },
      tone: "border-sky/50 bg-sky/8",
      iconBg: "bg-sky/20 text-sky",
      details: [
        { k: "Trigger", v: "Owner marks task as complete" },
        { k: "Evidence types", v: "Photos, signatures, stock count forms" },
        { k: "Attached to", v: `Task ${e.output.taskRef}` },
      ],
    },
    {
      key: "verification",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      title: { en: "Evidence verification (approve / reject)", ar: "التحقق من الإثبات (قبول / رفض)" },
      summary: {
        en: "Evidence reviewed — if approved, task closes; if rejected, task reopens with reason",
        ar: "مراجعة الإثبات — إذا قُبل تُغلق المهمة؛ إذا رُفض تُعاد فتح المهمة مع السبب",
      },
      tone: "border-brand/50 bg-brand/8",
      iconBg: "bg-brand/20 text-brand",
      details: [
        { k: "If approved", v: "Task closed & written back to C-Store", tone: "text-brand" },
        { k: "If rejected", v: "Task reopened — owner must resubmit", tone: "text-critical" },
        { k: "Rejection reason", v: "Attached to task for audit trail" },
        { k: "Requires", v: "Human approval (not automated)" },
      ],
    },
    {
      key: "closure",
      icon: <Check className="h-3.5 w-3.5" />,
      title: { en: "Verified → Closed & written back to C-Store", ar: "تم التحقق ← إغلاق وإعادة إلى C-Store" },
      summary: {
        en: `Evidence approved — ${e.output.taskRef} closed, outcome written back to C-Store with full audit log`,
        ar: `الإثبات معتمد — ${e.output.taskRef} أُغلقت، النتيجة كُتبت في C-Store مع سجل تدقيق كامل`,
      },
      tone: "border-brand/60 bg-brand/12",
      iconBg: "bg-brand/25 text-brand",
      details: [
        { k: "Status", v: "CLOSED — VERIFIED", tone: "text-brand" },
        { k: "Written to", v: "C-Store task log" },
        { k: "Audit", v: "Immutable log entry with full trace" },
        { k: "Commercial", v: `SAR ${e.decision.exposurePerDay.toLocaleString("en-US")}/day protected` },
      ],
    },
  ];
}

/* ─── horizontal flow indicator ──────────────────────────────── */

const FLOW_STEPS_EN = ["Assigned", "Ack", "Reminder", "Escalation", "Reassign", "Evidence", "Verify", "Closed"];
const FLOW_STEPS_AR = ["إسناد", "إقرار", "تذكير", "تصعيد", "إعادة إسناد", "إثبات", "تحقق", "إغلاق"];

function FlowIndicator({ lang }: { lang: Lang }) {
  const steps = lang === "en" ? FLOW_STEPS_EN : FLOW_STEPS_AR;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1">
          <span className="rounded-lg border border-border/60 bg-panel-raised px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {s}
          </span>
          {i < steps.length - 1 && <ArrowRight className="h-3 w-3 text-brand/60" />}
        </span>
      ))}
    </div>
  );
}

/* ─── human approval / override panel ────────────────────────── */

interface OverrideItem {
  icon: React.ReactNode;
  label: { en: string; ar: string };
}

const AUTOMATED: OverrideItem[] = [
  { icon: <Bell className="h-3.5 w-3.5" />, label: { en: "Reminders", ar: "التذكيرات" } },
  { icon: <ShieldAlert className="h-3.5 w-3.5" />, label: { en: "Escalation notifications", ar: "إشعارات التصعيد" } },
  { icon: <AlertTriangle className="h-3.5 w-3.5" />, label: { en: "SLA breach status update", ar: "تحديث حالة خرق الاتفاقية" } },
  { icon: <RefreshCw className="h-3.5 w-3.5" />, label: { en: "Notification retry", ar: "إعادة محاولة الإشعار" } },
];

const HUMAN_REQUIRED: OverrideItem[] = [
  { icon: <UserPlus className="h-3.5 w-3.5" />, label: { en: "Reassignment decision", ar: "قرار إعادة الإسناد" } },
  { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: { en: "Evidence approval / rejection", ar: "قبول / رفض الإثبات" } },
  { icon: <Clock className="h-3.5 w-3.5" />, label: { en: "Manual override of SLA timer", ar: "تعديل يدوي لمؤقت الاتفاقية" } },
  { icon: <XCircle className="h-3.5 w-3.5" />, label: { en: "Force-close a task", ar: "إغلاق إجباري للمهمة" } },
];

const MANUAL_OVERRIDE: OverrideItem[] = [
  { icon: <Clock className="h-3.5 w-3.5" />, label: { en: "Pause SLA clock temporarily", ar: "إيقاف مؤقت لمؤقت الاتفاقية" } },
  { icon: <ShieldAlert className="h-3.5 w-3.5" />, label: { en: "Bypass reminder & escalate now", ar: "تجاوز التذكير والتصعيد فورًا" } },
  { icon: <RotateCcw className="h-3.5 w-3.5" />, label: { en: "Re-open a closed task", ar: "إعادة فتح مهمة مغلقة" } },
];

function OverrideColumn({
  lang,
  icon,
  title,
  tone,
  items,
}: {
  lang: Lang;
  icon: React.ReactNode;
  title: { en: string; ar: string };
  tone: string;
  items: OverrideItem[];
}) {
  return (
    <div className={`rounded-2xl border p-3 ${tone}`}>
      <div className="mb-2.5 flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{title[lang]}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label.en} className="flex items-center gap-2 rounded-xl border border-border/30 bg-background/30 px-2.5 py-1.5">
            <span className="text-muted-foreground">{item.icon}</span>
            <span className="text-[10.5px] font-medium">{item.label[lang]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── notification retry panel ───────────────────────────────── */

interface RetryStep {
  icon: React.ReactNode;
  label: { en: string; ar: string };
  detail: { en: string; ar: string };
  tone: string;
}

const RETRY_STEPS: RetryStep[] = [
  {
    icon: <Send className="h-3.5 w-3.5" />,
    label: { en: "Primary channel", ar: "القناة الأساسية" },
    detail: { en: "Send via preferred channel (e.g. WhatsApp)", ar: "إرسال عبر القناة المفضلة (مثل واتساب)" },
    tone: "border-brand/40 bg-brand/8",
  },
  {
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    label: { en: "Retry (up to 3×)", ar: "إعادة المحاولة (حتى ٣ مرات)" },
    detail: { en: "Exponential backoff on same channel", ar: "تأخير تصاعدي على نفس القناة" },
    tone: "border-amber/40 bg-amber/8",
  },
  {
    icon: <ArrowRight className="h-3.5 w-3.5" />,
    label: { en: "Fallback channels", ar: "القنوات البديلة" },
    detail: { en: "SMS → Email → WhatsApp (configurable order)", ar: "رسالة → بريد → واتساب (ترتيب قابل للتعديل)" },
    tone: "border-amber/40 bg-amber/8",
  },
  {
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
    label: { en: "All channels exhausted", ar: "استنفاد جميع القنوات" },
    detail: { en: "Admin alerted — queued for manual follow-up", ar: "تنبيه المسؤول — وضع في طابور المتابعة اليدوية" },
    tone: "border-critical/40 bg-critical/8",
  },
];

/* ─── main component ─────────────────────────────────────────── */

export function ExceptionFlow({ lang, event }: { lang: Lang; event: DemoEvent }) {
  const en = lang === "en";
  const steps = stepsFor(event);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-3.5 rounded-3xl border border-border/60 bg-panel p-4">
      {/* header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-critical/40 bg-critical/10">
            <AlertTriangle className="h-4 w-4 text-critical" />
          </span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-critical">
              {en ? "Exception management" : "إدارة الاستثناءات"}
            </p>
            <h2 className="text-[13px] font-semibold tracking-tight">
              {en ? "What happens if the task is not completed?" : "ماذا يحدث إذا لم تُكمل المهمة؟"}
            </h2>
          </div>
        </div>
        <FlowIndicator lang={lang} />
      </div>

      {/* exception steps */}
      <div className="space-y-2">
        {steps.map((step, i) => {
          const isOpen = expandedStep === step.key;
          return (
            <div
              key={step.key}
              className={`overflow-hidden rounded-2xl border transition-all ${step.tone}`}
            >
              <button
                onClick={() => setExpandedStep(isOpen ? null : step.key)}
                className="flex w-full items-start gap-3 px-3.5 py-3 text-left"
              >
                <span className="relative mt-0.5 flex flex-col items-center">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${step.iconBg}`}>
                    {step.icon}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mt-1 h-3 w-px bg-border/60" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="block text-[12px] font-semibold tracking-tight">{step.title[lang]}</span>
                    {isOpen ? (
                      <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {step.summary[lang]}
                  </span>
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border/40 px-3.5 py-2.5">
                  {step.details.map((d) => (
                    <Row key={d.k} k={d.k} v={d.v} tone={d.tone} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* human approval & manual override */}
      <div className="mt-1 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber" />
          <h3 className="text-[12px] font-semibold tracking-tight">
            {en ? "Human approval & manual override" : "الموافقة البشرية والتجاوز اليدوي"}
          </h3>
        </div>
        <div className="grid gap-2.5 md:grid-cols-3">
          <OverrideColumn
            lang={lang}
            icon={<RefreshCw className="h-3.5 w-3.5 text-sky" />}
            title={{ en: "⚙️ Fully automated", ar: "⚙️ مؤتمت بالكامل" }}
            tone="border-sky/40 bg-sky/5"
            items={AUTOMATED}
          />
          <OverrideColumn
            lang={lang}
            icon={<UserCheck className="h-3.5 w-3.5 text-amber" />}
            title={{ en: "👤 Human approval required", ar: "👤 موافقة بشرية مطلوبة" }}
            tone="border-amber/40 bg-amber/5"
            items={HUMAN_REQUIRED}
          />
          <OverrideColumn
            lang={lang}
            icon={<Users className="h-3.5 w-3.5 text-[oklch(0.7_0.15_280)]" />}
            title={{ en: "🔧 Manual override available", ar: "🔧 تجاوز يدوي متاح" }}
            tone="border-[oklch(0.7_0.15_280)]/40 bg-[oklch(0.7_0.15_280)]/5"
            items={MANUAL_OVERRIDE}
          />
        </div>
        <div className="rounded-xl border border-dashed border-amber/40 bg-amber/5 px-3 py-2 text-[10.5px] leading-relaxed text-muted-foreground">
          {en
            ? "⚠️ Force-closing a task or overriding the SLA timer are audited actions. Every manual override is logged with the operator's identity, timestamp, and justification."
            : "⚠️ إغلاق المهمة إجباريًا أو تعديل مؤقت الاتفاقية هي إجراءات مراقبة. كل تجاوز يدوي يُسجل مع هوية المشغّل والتوقيت والمبرر."}
        </div>
      </div>

      {/* notification retry flow */}
      <div className="mt-1 space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-brand" />
          <h3 className="text-[12px] font-semibold tracking-tight">
            {en ? "Failed notification retry flow" : "مسار إعادة محاولة الإشعارات الفاشلة"}
          </h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {RETRY_STEPS.map((rs, i) => (
            <div key={rs.label.en} className="flex items-start gap-3">
              <div className={`flex flex-col items-center`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border ${rs.tone}`}>
                  {rs.icon}
                </span>
                {i < RETRY_STEPS.length - 1 && (
                  <ArrowRight className="mt-1 h-3 w-3 text-border/60 rotate-0 sm:rotate-0" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold leading-tight">{rs.label[lang]}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{rs.detail[lang]}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/50 bg-panel-raised/60 p-3 sm:grid-cols-4">
          {[
            { k: en ? "Max retries/channel" : "أقصى محاولات/قناة", v: "3×" },
            { k: en ? "Fallback order" : "ترتيب البديل", v: "SMS → Email → WhatsApp" },
            { k: en ? "All exhausted" : "استنفاد الكل", v: en ? "Admin alert" : "تنبيه المسؤول" },
            { k: en ? "Logging" : "التسجيل", v: en ? "Every attempt" : "كل محاولة" },
          ].map((item) => (
            <div key={item.k} className="text-center">
              <p className="text-[8.5px] uppercase tracking-wider text-muted-foreground">{item.k}</p>
              <p className="mt-0.5 text-[11px] font-semibold tabular-nums">{item.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* footer note */}
      <div className="rounded-2xl border border-brand/30 bg-brand/8 px-3.5 py-2.5 text-[10.5px] leading-relaxed text-muted-foreground">
        {en
          ? "💡 This flow ensures no task falls through the cracks. Every unacknowledged, stalled, or failed task is automatically escalated until a human resolves it — with full audit logging at every step."
          : "💡 هذا المسار يضمن عدم سقوط أي مهمة. كل مهمة غير مُقرّة أو متعطلة أو فاشلة تُصعّد تلقائيًا حتى يحلها إنسان — مع تسجيل تدقيق كامل في كل خطوة."}
      </div>
    </section>
  );
}
