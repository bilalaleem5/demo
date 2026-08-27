import type { Bilingual, DemoEvent } from "./data";

export interface Rule {
  id: string;
  label: Bilingual;
  evidence: Bilingual;
  matched: boolean;
  weight: number;
}

export interface Candidate {
  name: Bilingual;
  role: Bilingual;
  distanceKm: number;
  openTasks: number;
  skill: number;
  score: number;
  chosen: boolean;
  reason: Bilingual;
}

export interface Notification {
  to: Bilingual;
  role: Bilingual;
  channel: "WhatsApp" | "Push" | "Email" | "C-Store" | "SMS";
  at: string;
  message: Bilingual;
  status: Bilingual;
}

export interface TimelineStep {
  at: string;
  actor: "C-Store" | "O.N.E.Tech" | "Field" | "Distributor";
  text: Bilingual;
}

const ALT_A: { name: Bilingual; role: Bilingual } = {
  name: { en: "Mohammed Al-Ghamdi", ar: "محمد الغامدي" },
  role: { en: "Merchandiser L1", ar: "منسق رفوف م١" },
};
const ALT_B: { name: Bilingual; role: Bilingual } = {
  name: { en: "Yasmin Al-Zahrani", ar: "ياسمين الزهراني" },
  role: { en: "Promoter", ar: "مروّجة" },
};

function addMinutes(hhmm: string, mins: number) {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function rulesFor(e: DemoEvent): Rule[] {
  const critical = e.decision.priority === "CRITICAL";
  const keyAccount = e.context.account.en.startsWith("P1");
  return [
    {
      id: "R-01",
      label: { en: "Confidence ≥ 85% → accept signal", ar: "الثقة ≥ ٨٥٪ ← قبول الإشارة" },
      evidence: { en: `IR confidence ${e.confidence}%`, ar: `ثقة التعرّف ${e.confidence}%` },
      matched: e.confidence >= 85,
      weight: 1.0,
    },
    {
      id: "R-02",
      label: { en: "Top-10 SKU in Tier A/B store", ar: "منتج ضمن أفضل ١٠ في متجر فئة أ/ب" },
      evidence: { en: `${e.sku.rank} · Tier ${e.store.tier}`, ar: `${e.sku.rank} · فئة ${e.store.tier}` },
      matched: true,
      weight: 2.0,
    },
    {
      id: "R-03",
      label: { en: "Key-account protection rule", ar: "قاعدة حماية الحسابات الرئيسية" },
      evidence: e.context.account,
      matched: keyAccount,
      weight: 1.5,
    },
    {
      id: "R-04",
      label: { en: "Repeat incident inside 7 days", ar: "تكرار الحادث خلال ٧ أيام" },
      evidence: e.context.lastOos,
      matched: /3 days|6 days/.test(e.context.lastOos.en),
      weight: 2.5,
    },
    {
      id: "R-05",
      label: { en: "Exposure > SAR 3,000/day → escalate", ar: "خسارة > ٣٬٠٠٠ ريال يوميًا ← تصعيد" },
      evidence: {
        en: `SAR ${e.decision.exposurePerDay.toLocaleString("en-US")}/day`,
        ar: `${e.decision.exposurePerDay.toLocaleString("en-US")} ريال يوميًا`,
      },
      matched: e.decision.exposurePerDay > 3000,
      weight: 3.0,
    },
    {
      id: "R-06",
      label: { en: "No distributor visit inside SLA window", ar: "لا زيارة موزع ضمن نافذة الاتفاقية" },
      evidence: e.context.coverage,
      matched: critical,
      weight: 1.5,
    },
  ];
}

export function candidatesFor(e: DemoEvent): Candidate[] {
  const base: Candidate[] = [
    {
      name: e.output.owner,
      role: e.output.ownerRole,
      distanceKm: 1.2,
      openTasks: 2,
      skill: 97,
      score: 94,
      chosen: true,
      reason: {
        en: "Closest to store, lowest open workload, certified for this action type",
        ar: "الأقرب للمتجر، أقل عبء مفتوح، ومعتمد لهذا النوع من الإجراءات",
      },
    },
    {
      ...ALT_A,
      distanceKm: 6.8,
      openTasks: 5,
      skill: 88,
      score: 71,
      chosen: false,
      reason: { en: "Further away and already at task limit", ar: "أبعد مسافة وبلغ حد المهام" },
    },
    {
      ...ALT_B,
      distanceKm: 12.4,
      openTasks: 1,
      skill: 62,
      score: 58,
      chosen: false,
      reason: { en: "Free but not certified for this SKU category", ar: "متاحة لكن غير معتمدة لهذه الفئة" },
    },
  ];
  return base;
}

export function notificationsFor(e: DemoEvent): Notification[] {
  const t0 = e.capturedAt;
  const critical = e.decision.priority === "CRITICAL";
  const list: Notification[] = [
    {
      to: e.output.owner,
      role: e.output.ownerRole,
      channel: "WhatsApp",
      at: addMinutes(t0, 1),
      message: {
        en: `${e.decision.priority}: ${e.sku.name.en} — ${e.output.action.en} at ${e.store.name.en}. Task ${e.output.taskRef}, due in ${e.output.slaLabel}.`,
        ar: `${e.decision.priority}: ${e.sku.name.ar} — ${e.output.action.ar} في ${e.store.name.ar}. المهمة ${e.output.taskRef} خلال ${e.output.slaLabel}.`,
      },
      status: { en: "Delivered · read", ar: "تم التسليم · مقروء" },
    },
    {
      to:
        e.output.owner.en === "Khalid Al-Otaibi"
          ? { en: "Ahmed Al-Rashidi", ar: "أحمد الراشدي" }
          : { en: "Khalid Al-Otaibi", ar: "خالد العتيبي" },
      role: { en: "Regional Supervisor", ar: "مشرف إقليمي" },
      channel: "Push",
      at: addMinutes(t0, 1),
      message: {
        en: `Visibility copy: ${e.store.name.en} ${e.type} assigned to ${e.output.owner.en}. You are the escalation owner.`,
        ar: `نسخة للاطلاع: ${e.store.name.ar} ${e.type} أُسندت إلى ${e.output.owner.ar}. أنت مسؤول التصعيد.`,
      },
      status: { en: "Delivered", ar: "تم التسليم" },
    },
    {
      to: { en: e.output.distributor, ar: e.output.distributor },
      role: { en: "Distributor replenishment desk", ar: "مكتب التعبئة لدى الموزع" },
      channel: "Email",
      at: addMinutes(t0, 2),
      message: {
        en: `Replenishment request — ${e.sku.name.en} (${e.sku.id}) for ${e.store.name.en} (${e.store.id}). Ref ${e.output.taskRef}.`,
        ar: `طلب تعبئة — ${e.sku.name.ar} (${e.sku.id}) لمتجر ${e.store.name.ar} (${e.store.id}). المرجع ${e.output.taskRef}.`,
      },
      status: { en: "Queued · acknowledged", ar: "بالانتظار · تم الاستلام" },
    },
    {
      to: { en: "C-Store platform", ar: "منصة C-Store" },
      role: { en: "System write-back", ar: "كتابة آلية" },
      channel: "C-Store",
      at: addMinutes(t0, 2),
      message: {
        en: `Task ${e.output.taskRef} created against ${e.id} with owner, priority ${e.decision.priority} and SLA ${e.output.slaLabel}.`,
        ar: `أُنشئت المهمة ${e.output.taskRef} على ${e.id} مع المسؤول والأولوية ${e.decision.priority} والاتفاقية ${e.output.slaLabel}.`,
      },
      status: { en: "Written back", ar: "تمت الكتابة" },
    },
  ];
  if (critical) {
    list.push({
      to: { en: "Key Account Manager", ar: "مدير الحساب الرئيسي" },
      role: { en: "Commercial", ar: "تجاري" },
      channel: "SMS",
      at: addMinutes(t0, 3),
      message: {
        en: `Critical exposure SAR ${e.decision.exposurePerDay.toLocaleString("en-US")}/day at ${e.store.name.en}. Auto-escalation armed at 1h.`,
        ar: `خسارة حرجة ${e.decision.exposurePerDay.toLocaleString("en-US")} ريال يوميًا في ${e.store.name.ar}. التصعيد التلقائي بعد ساعة.`,
      },
      status: { en: "Delivered", ar: "تم التسليم" },
    });
  }
  return list;
}

export function timelineFor(e: DemoEvent): TimelineStep[] {
  const t = e.capturedAt;
  return [
    {
      at: t,
      actor: "Field",
      text: {
        en: `Field agent scans shelf in ${e.store.name.en} — ${e.type} captured`,
        ar: `المندوب يمسح الرف في ${e.store.name.ar} — تم رصد ${e.type}`,
      },
    },
    {
      at: t,
      actor: "C-Store",
      text: { en: `${e.id} logged as a plain record, no owner`, ar: `${e.id} مسجل كسجل عادي بلا مسؤول` },
    },
    {
      at: addMinutes(t, 1),
      actor: "O.N.E.Tech",
      text: {
        en: `Enriched, scored ${e.decision.urgency}/10, decision: ${e.decision.verdict.en}`,
        ar: `إثراء وتقييم ${e.decision.urgency}/١٠، القرار: ${e.decision.verdict.ar}`,
      },
    },
    {
      at: addMinutes(t, 1),
      actor: "O.N.E.Tech",
      text: {
        en: `${e.output.taskRef} created and assigned to ${e.output.owner.en}`,
        ar: `${e.output.taskRef} أُنشئت وأُسندت إلى ${e.output.owner.ar}`,
      },
    },
    {
      at: addMinutes(t, 2),
      actor: "Distributor",
      text: {
        en: `${e.output.distributor} acknowledges replenishment request`,
        ar: `${e.output.distributor} يؤكد استلام طلب التعبئة`,
      },
    },
    {
      at: addMinutes(t, 47),
      actor: "Field",
      text: {
        en: "Owner uploads shelf photo + stock count as evidence",
        ar: "المسؤول يرفع صورة الرف والجرد كإثبات",
      },
    },
    {
      at: addMinutes(t, 52),
      actor: "O.N.E.Tech",
      text: {
        en: `Evidence verified, SLA met, outcome written back to C-Store`,
        ar: "تم التحقق من الإثبات، الالتزام بالاتفاقية، وإعادة النتيجة إلى C-Store",
      },
    },
  ];
}
