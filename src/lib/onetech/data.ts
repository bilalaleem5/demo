export type Lang = "en" | "ar";

export interface Bilingual {
  en: string;
  ar: string;
}

export type EventType = "OOS" | "LOW_STOCK" | "PLANOGRAM" | "EXPIRY" | "DAMAGE";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM";
export type ColumnId = "assigned" | "in_progress" | "awaiting_evidence" | "resolved";

export interface DemoEvent {
  id: string;
  type: EventType;
  capturedAt: string;
  confidence: number;
  sku: { id: string; name: Bilingual; rank: string };
  store: { id: string; name: Bilingual; city: Bilingual; tier: "A" | "B" | "C" };
  voiceNote: string;
  /* enrichment produced by the intelligence layer */
  context: {
    lastOos: Bilingual;
    account: Bilingual;
    shelfShare: string;
    coverage: Bilingual;
  };
  decision: {
    exposurePerDay: number;
    urgency: number;
    priority: Priority;
    policy: Bilingual;
    verdict: Bilingual;
  };
  output: {
    taskRef: string;
    action: Bilingual;
    owner: Bilingual;
    ownerRole: Bilingual;
    distributor: string;
    slaLabel: string;
    escalation: Bilingual;
  };
}

export interface Task {
  id: string;
  taskRef: string;
  eventId: string;
  priority: Priority;
  sku: Bilingual;
  store: Bilingual;
  action: Bilingual;
  owner: Bilingual;
  sla: string;
  slaState: "ok" | "warn" | "done";
  column: ColumnId;
  value: number;
}

export const COLUMNS: { id: ColumnId; label: Bilingual }[] = [
  { id: "assigned", label: { en: "Assigned", ar: "مُسند" } },
  { id: "in_progress", label: { en: "In Progress", ar: "قيد التنفيذ" } },
  { id: "awaiting_evidence", label: { en: "Awaiting Evidence", ar: "بانتظار الإثبات" } },
  { id: "resolved", label: { en: "Resolved", ar: "تم الحل" } },
];

export const EVENT_LABEL: Record<EventType, Bilingual> = {
  OOS: { en: "Out of stock", ar: "نفاد المخزون" },
  LOW_STOCK: { en: "Low stock", ar: "مخزون منخفض" },
  PLANOGRAM: { en: "Planogram breach", ar: "مخالفة الرف" },
  EXPIRY: { en: "Near expiry", ar: "قرب انتهاء الصلاحية" },
  DAMAGE: { en: "Damaged stock", ar: "منتج تالف" },
};

export const EVENTS: DemoEvent[] = [
  {
    id: "EVT-9412",
    type: "OOS",
    capturedAt: "09:14",
    confidence: 96,
    sku: { id: "SKU-11902", name: { en: "Nescafé 3-in-1", ar: "نسكافيه ٣ في ١" }, rank: "Top 3" },
    store: {
      id: "STR-0091",
      name: { en: "Carrefour Riyadh", ar: "كارفور الرياض" },
      city: { en: "Riyadh", ar: "الرياض" },
      tier: "A",
    },
    voiceNote: "الرف فارغ من نسكافيه منذ الصباح",
    context: {
      lastOos: { en: "3 days ago — repeat offender", ar: "قبل ٣ أيام — تكرار" },
      account: { en: "P1 · Key account", ar: "أولوية ١ · حساب رئيسي" },
      shelfShare: "18% → 0%",
      coverage: { en: "Distributor visit in 4 days", ar: "زيارة الموزع بعد ٤ أيام" },
    },
    decision: {
      exposurePerDay: 5100,
      urgency: 9.2,
      priority: "CRITICAL",
      policy: { en: "OOS Critical Response SOP", ar: "سياسة الاستجابة للنفاد الحرج" },
      verdict: { en: "Escalate + emergency restock", ar: "تصعيد + تعبئة عاجلة" },
    },
    output: {
      taskRef: "ONT-2847",
      action: { en: "Emergency restock", ar: "تعبئة عاجلة" },
      owner: { en: "Ahmed Al-Rashidi", ar: "أحمد الراشدي" },
      ownerRole: { en: "Merchandiser L2", ar: "منسق رفوف م٢" },
      distributor: "Almarai Distribution",
      slaLabel: "4h 00m",
      escalation: { en: "Auto-escalates to Regional Supervisor at 1h", ar: "تصعيد تلقائي للمشرف الإقليمي عند ساعة" },
    },
  },
  {
    id: "EVT-9408",
    type: "LOW_STOCK",
    capturedAt: "08:52",
    confidence: 91,
    sku: { id: "SKU-10231", name: { en: "Pepsi 500ml", ar: "بيبسي ٥٠٠ مل" }, rank: "Top 5" },
    store: {
      id: "STR-0142",
      name: { en: "Panda Jeddah", ar: "بنده جدة" },
      city: { en: "Jeddah", ar: "جدة" },
      tier: "A",
    },
    voiceNote: "الكمية أقل من الحد الأدنى على الرف",
    context: {
      lastOos: { en: "11 days ago", ar: "قبل ١١ يومًا" },
      account: { en: "P1 · Key account", ar: "أولوية ١ · حساب رئيسي" },
      shelfShare: "22% → 7%",
      coverage: { en: "Van sales route today", ar: "خط البيع المتنقل اليوم" },
    },
    decision: {
      exposurePerDay: 4200,
      urgency: 7.4,
      priority: "HIGH",
      policy: { en: "Replenishment threshold policy", ar: "سياسة حد إعادة التعبئة" },
      verdict: { en: "Assign restock, no escalation", ar: "إسناد تعبئة دون تصعيد" },
    },
    output: {
      taskRef: "ONT-2846",
      action: { en: "Restock from backroom", ar: "تعبئة من المخزن" },
      owner: { en: "Sara Mohammed", ar: "سارة محمد" },
      ownerRole: { en: "Promoter", ar: "مروّجة" },
      distributor: "PepsiCo KSA",
      slaLabel: "6h 00m",
      escalation: { en: "No escalation — within threshold", ar: "بدون تصعيد — ضمن الحد" },
    },
  },
  {
    id: "EVT-9401",
    type: "PLANOGRAM",
    capturedAt: "08:20",
    confidence: 88,
    sku: { id: "SKU-10884", name: { en: "Lay's Classic 50g", ar: "ليز كلاسيك ٥٠ جم" }, rank: "Top 10" },
    store: {
      id: "STR-0233",
      name: { en: "Lulu Dammam", ar: "لولو الدمام" },
      city: { en: "Dammam", ar: "الدمام" },
      tier: "B",
    },
    voiceNote: "المنتج موضوع في الرف الخطأ",
    context: {
      lastOos: { en: "No OOS in 30 days", ar: "لا نفاد خلال ٣٠ يومًا" },
      account: { en: "P2 · Growth account", ar: "أولوية ٢ · حساب نمو" },
      shelfShare: "12% → 6%",
      coverage: { en: "Merchandiser on site", ar: "منسق الرفوف بالموقع" },
    },
    decision: {
      exposurePerDay: 2650,
      urgency: 5.8,
      priority: "MEDIUM",
      policy: { en: "Planogram compliance SOP", ar: "سياسة الالتزام بالرف" },
      verdict: { en: "Fix placement + photo proof", ar: "تصحيح العرض + إثبات صوري" },
    },
    output: {
      taskRef: "ONT-2843",
      action: { en: "Planogram correction", ar: "تصحيح الرف" },
      owner: { en: "Noura Al-Harbi", ar: "نورة الحربي" },
      ownerRole: { en: "Merchandiser L1", ar: "منسقة رفوف م١" },
      distributor: "Snack Foods Co.",
      slaLabel: "8h 00m",
      escalation: { en: "Supervisor notified on breach only", ar: "إشعار المشرف عند التجاوز فقط" },
    },
  },
  {
    id: "EVT-9396",
    type: "EXPIRY",
    capturedAt: "07:58",
    confidence: 94,
    sku: { id: "SKU-12440", name: { en: "Red Bull 250ml", ar: "ريد بُل ٢٥٠ مل" }, rank: "Top 8" },
    store: {
      id: "STR-0318",
      name: { en: "HyperPanda Makkah Rd", ar: "هايبر بنده طريق مكة" },
      city: { en: "Riyadh", ar: "الرياض" },
      tier: "A",
    },
    voiceNote: "تاريخ الصلاحية قارب على الانتهاء",
    context: {
      lastOos: { en: "6 days ago", ar: "قبل ٦ أيام" },
      account: { en: "P1 · Key account", ar: "أولوية ١ · حساب رئيسي" },
      shelfShare: "9% → 9%",
      coverage: { en: "Returns window closes in 48h", ar: "نافذة الإرجاع تغلق خلال ٤٨ ساعة" },
    },
    decision: {
      exposurePerDay: 3800,
      urgency: 8.1,
      priority: "HIGH",
      policy: { en: "Expiry & returns policy", ar: "سياسة الصلاحية والمرتجعات" },
      verdict: { en: "Pull stock + raise return claim", ar: "سحب المخزون + مطالبة إرجاع" },
    },
    output: {
      taskRef: "ONT-2839",
      action: { en: "Stock pull + return claim", ar: "سحب مخزون + مطالبة" },
      owner: { en: "Faisal Al-Dossary", ar: "فيصل الدوسري" },
      ownerRole: { en: "Distributor Liaison", ar: "منسق الموزع" },
      distributor: "Red Bull KSA",
      slaLabel: "5h 00m",
      escalation: { en: "Escalates to Key Account Manager", ar: "تصعيد لمدير الحساب الرئيسي" },
    },
  },
  {
    id: "EVT-9390",
    type: "DAMAGE",
    capturedAt: "07:31",
    confidence: 90,
    sku: { id: "SKU-13077", name: { en: "Dove Soap 135g", ar: "صابون دوف ١٣٥ جم" }, rank: "Top 15" },
    store: {
      id: "STR-0405",
      name: { en: "Tamimi Markets", ar: "أسواق التميمي" },
      city: { en: "Khobar", ar: "الخبر" },
      tier: "B",
    },
    voiceNote: "تم رصد منتج تالف في العرض",
    context: {
      lastOos: { en: "No OOS in 14 days", ar: "لا نفاد خلال ١٤ يومًا" },
      account: { en: "P2 · Growth account", ar: "أولوية ٢ · حساب نمو" },
      shelfShare: "8% → 8%",
      coverage: { en: "Weekly audit due", ar: "التدقيق الأسبوعي مستحق" },
    },
    decision: {
      exposurePerDay: 1950,
      urgency: 4.6,
      priority: "MEDIUM",
      policy: { en: "Damaged goods SOP", ar: "سياسة المنتجات التالفة" },
      verdict: { en: "Remove + log damage claim", ar: "إزالة + تسجيل مطالبة" },
    },
    output: {
      taskRef: "ONT-2835",
      action: { en: "Remove damaged units", ar: "إزالة الوحدات التالفة" },
      owner: { en: "Khalid Al-Otaibi", ar: "خالد العتيبي" },
      ownerRole: { en: "Regional Supervisor", ar: "مشرف إقليمي" },
      distributor: "Unilever Arabia",
      slaLabel: "12h 00m",
      escalation: { en: "No escalation configured", ar: "لا يوجد تصعيد" },
    },
  },
];

export const TASKS: Task[] = [
  {
    id: "T1",
    taskRef: "ONT-2846",
    eventId: "EVT-9408",
    priority: "HIGH",
    sku: { en: "Pepsi 500ml", ar: "بيبسي ٥٠٠ مل" },
    store: { en: "Panda Jeddah", ar: "بنده جدة" },
    action: { en: "Restock from backroom", ar: "تعبئة من المخزن" },
    owner: { en: "Sara Mohammed", ar: "سارة محمد" },
    sla: "5h 12m",
    slaState: "ok",
    column: "assigned",
    value: 4200,
  },
  {
    id: "T2",
    taskRef: "ONT-2843",
    eventId: "EVT-9401",
    priority: "MEDIUM",
    sku: { en: "Lay's Classic 50g", ar: "ليز كلاسيك ٥٠ جم" },
    store: { en: "Lulu Dammam", ar: "لولو الدمام" },
    action: { en: "Planogram correction", ar: "تصحيح الرف" },
    owner: { en: "Noura Al-Harbi", ar: "نورة الحربي" },
    sla: "7h 40m",
    slaState: "ok",
    column: "assigned",
    value: 2650,
  },
  {
    id: "T3",
    taskRef: "ONT-2839",
    eventId: "EVT-9396",
    priority: "HIGH",
    sku: { en: "Red Bull 250ml", ar: "ريد بُل ٢٥٠ مل" },
    store: { en: "HyperPanda Makkah Rd", ar: "هايبر بنده طريق مكة" },
    action: { en: "Stock pull + return claim", ar: "سحب مخزون + مطالبة" },
    owner: { en: "Faisal Al-Dossary", ar: "فيصل الدوسري" },
    sla: "0h 48m",
    slaState: "warn",
    column: "in_progress",
    value: 3800,
  },
  {
    id: "T4",
    taskRef: "ONT-2835",
    eventId: "EVT-9390",
    priority: "MEDIUM",
    sku: { en: "Dove Soap 135g", ar: "صابون دوف ١٣٥ جم" },
    store: { en: "Tamimi Markets", ar: "أسواق التميمي" },
    action: { en: "Remove damaged units", ar: "إزالة الوحدات التالفة" },
    owner: { en: "Khalid Al-Otaibi", ar: "خالد العتيبي" },
    sla: "9h 05m",
    slaState: "ok",
    column: "in_progress",
    value: 1950,
  },
  {
    id: "T5",
    taskRef: "ONT-2830",
    eventId: "EVT-9377",
    priority: "HIGH",
    sku: { en: "Nescafé 3-in-1", ar: "نسكافيه ٣ في ١" },
    store: { en: "Carrefour Jeddah", ar: "كارفور جدة" },
    action: { en: "Shelf photo verification", ar: "تحقق بصورة الرف" },
    owner: { en: "Sara Mohammed", ar: "سارة محمد" },
    sla: "1h 26m",
    slaState: "warn",
    column: "awaiting_evidence",
    value: 5100,
  },
  {
    id: "T6",
    taskRef: "ONT-2824",
    eventId: "EVT-9361",
    priority: "MEDIUM",
    sku: { en: "Lay's Classic 50g", ar: "ليز كلاسيك ٥٠ جم" },
    store: { en: "Tamimi Markets", ar: "أسواق التميمي" },
    action: { en: "Restock verification", ar: "تحقق التعبئة" },
    owner: { en: "Noura Al-Harbi", ar: "نورة الحربي" },
    sla: "3h 02m",
    slaState: "ok",
    column: "awaiting_evidence",
    value: 2650,
  },
  {
    id: "T7",
    taskRef: "ONT-2818",
    eventId: "EVT-9344",
    priority: "CRITICAL",
    sku: { en: "Red Bull 250ml", ar: "ريد بُل ٢٥٠ مل" },
    store: { en: "Carrefour Riyadh", ar: "كارفور الرياض" },
    action: { en: "Emergency restock", ar: "تعبئة عاجلة" },
    owner: { en: "Ahmed Al-Rashidi", ar: "أحمد الراشدي" },
    sla: "Closed 1h 12m",
    slaState: "done",
    column: "resolved",
    value: 3800,
  },
  {
    id: "T8",
    taskRef: "ONT-2811",
    eventId: "EVT-9330",
    priority: "HIGH",
    sku: { en: "Pepsi 500ml", ar: "بيبسي ٥٠٠ مل" },
    store: { en: "Panda Riyadh", ar: "بنده الرياض" },
    action: { en: "Distributor replenishment", ar: "تعبئة من الموزع" },
    owner: { en: "Faisal Al-Dossary", ar: "فيصل الدوسري" },
    sla: "Closed 2h 40m",
    slaState: "done",
    column: "resolved",
    value: 4200,
  },
];

export const STAGES: { key: string; title: Bilingual; caption: Bilingual }[] = [
  {
    key: "ingest",
    title: { en: "Signal ingested", ar: "استقبال الإشارة" },
    caption: { en: "Raw C-Store event accepted", ar: "قبول الحدث الخام من C-Store" },
  },
  {
    key: "context",
    title: { en: "Context added", ar: "إضافة السياق" },
    caption: { en: "SKU rank, store tier, history", ar: "رتبة المنتج، فئة المتجر، السجل" },
  },
  {
    key: "decision",
    title: { en: "Impact scored", ar: "تقييم الأثر" },
    caption: { en: "Money at risk + urgency + policy", ar: "الخسارة والإلحاح والسياسة" },
  },
  {
    key: "execute",
    title: { en: "Action orchestrated", ar: "تنسيق الإجراء" },
    caption: { en: "Task, owner, WhatsApp, distributor", ar: "مهمة، مسؤول، واتساب، موزع" },
  },
  {
    key: "sla",
    title: { en: "SLA attached", ar: "ربط اتفاقية الخدمة" },
    caption: { en: "Deadline + escalation owner", ar: "موعد نهائي ومسؤول تصعيد" },
  },
  {
    key: "close", 
    title: { en: "Closed & written back", ar: "الإغلاق والإعادة" },
    caption: { en: "Evidence verified, C-Store updated", ar: "تحقق الإثبات وتحديث C-Store" },
  },
];

export const KPIS: { label: Bilingual; value: string; sub: Bilingual; tone: "accent" | "critical" | "neutral" }[] = [
  {
    label: { en: "Events received today", ar: "الأحداث المستلمة اليوم" },
    value: "1,284",
    sub: { en: "from C-Store field app", ar: "من تطبيق C-Store" },
    tone: "neutral",
  },
  {
    label: { en: "Actions auto-assigned", ar: "إسناد تلقائي" },
    value: "94%",
    sub: { en: "no human dispatcher", ar: "بدون منسق بشري" },
    tone: "accent",
  },
  {
    label: { en: "Critical OOS open", ar: "نفاد حرج مفتوح" },
    value: "3",
    sub: { en: "all inside SLA", ar: "جميعها ضمن الاتفاقية" },
    tone: "critical",
  },
  {
    label: { en: "Avg response time", ar: "متوسط زمن الاستجابة" },
    value: "1h 42m",
    sub: { en: "was 9h 10m before", ar: "كان ٩:١٠ سابقًا" },
    tone: "neutral",
  },
  {
    label: { en: "Revenue protected", ar: "الإيراد المحمي" },
    value: "SAR 847,000",
    sub: { en: "last 30 days", ar: "آخر ٣٠ يومًا" },
    tone: "accent",
  },
];
