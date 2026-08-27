import {
  ArrowRight,
  BellRing,
  Brain,
  Check,
  ClipboardCheck,
  Inbox,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Timer,
  Truck,
  UserCheck,
} from "lucide-react";
import { STAGES, type DemoEvent, type Lang } from "@/lib/onetech/data";

const sar = (n: number) => `SAR ${n.toLocaleString("en-US")}`;

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/30 py-1.5 last:border-0">
      <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k}</span>
      <span className={`text-right text-[11.5px] font-semibold leading-tight ${tone ?? "text-foreground"}`}>{v}</span>
    </div>
  );
}

function Panel({
  step,
  kicker,
  title,
  icon,
  tone,
  children,
}: {
  step: string;
  kicker: string;
  title: string;
  icon: React.ReactNode;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-panel">
      <header className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${tone}`}>{icon}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="rounded bg-border/70 px-1.5 py-0.5 tabular-nums">{step}</span>
            {kicker}
          </p>
          <h2 className="truncate text-[13px] font-semibold tracking-tight">{title}</h2>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-3.5">{children}</div>
    </section>
  );
}

function OutRow({
  done,
  icon,
  title,
  detail,
}: {
  done: boolean;
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-3 transition-all duration-500 ${
        done ? "border-brand/40 bg-brand/8" : "border-border/40 bg-panel-raised/50 opacity-40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
          done ? "bg-brand/20 text-brand" : "bg-border/60 text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold leading-tight">{title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

export function FlowTrace({
  lang,
  event,
  stageIndex,
  expanded,
  onToggle,
}: {
  lang: Lang;
  event: DemoEvent;
  stageIndex: number;
  expanded: number | null;
  onToggle: (i: number) => void;
}) {
  const en = lang === "en";
  const complete = stageIndex >= STAGES.length;
  const done = (i: number) => complete || stageIndex > i;

  const result = (i: number): string => {
    switch (i) {
      case 0:
        return en
          ? `Accepted ${event.id} · ${event.confidence}% image-recognition confidence`
          : `تم قبول ${event.id} · ثقة ${event.confidence}%`;
      case 1:
        return en
          ? `${event.sku.rank} SKU · Tier ${event.store.tier} store · ${event.context.account.en}`
          : `${event.sku.rank} · متجر فئة ${event.store.tier} · ${event.context.account.ar}`;
      case 2:
        return en
          ? `${sar(event.decision.exposurePerDay)}/day at risk → ${event.decision.verdict.en}`
          : `${sar(event.decision.exposurePerDay)} يوميًا معرضة للخطر ← ${event.decision.verdict.ar}`;
      case 3:
        return en
          ? `${event.output.taskRef} created · owner ${event.output.owner.en} · WhatsApp sent`
          : `${event.output.taskRef} · المسؤول ${event.output.owner.ar} · تم إرسال واتساب`;
      case 4:
        return en
          ? `SLA ${event.output.slaLabel} · ${event.output.escalation.en}`
          : `الاتفاقية ${event.output.slaLabel} · ${event.output.escalation.ar}`;
      default:
        return en ? "Evidence verified, outcome written back to C-Store" : "تم التحقق وإعادة النتيجة إلى C-Store";
    }
  };

  const detail = (i: number) => {
    switch (i) {
      case 0:
        return (
          <>
            <Row k="event_id" v={event.id} />
            <Row k="source" v="C-Store Mobile · IR scan" tone="text-brand" />
            <Row k="captured_at" v={event.capturedAt} />
          </>
        );
      case 1:
        return (
          <>
            <Row k={en ? "SKU rank" : "رتبة المنتج"} v={event.sku.rank} />
            <Row k={en ? "Store tier" : "فئة المتجر"} v={`Tier ${event.store.tier} · ${event.store.city[lang]}`} />
            <Row k={en ? "Last OOS" : "آخر نفاد"} v={event.context.lastOos[lang]} />
            <Row k={en ? "Shelf share" : "حصة الرف"} v={event.context.shelfShare} />
            <Row k={en ? "Coverage" : "التغطية"} v={event.context.coverage[lang]} />
          </>
        );
      case 2:
        return (
          <>
            <Row k={en ? "Exposure" : "الأثر"} v={`${sar(event.decision.exposurePerDay)}/day`} tone="text-amber" />
            <Row k={en ? "Urgency" : "الإلحاح"} v={`${event.decision.urgency} / 10`} tone="text-critical" />
            <Row k={en ? "Priority" : "الأولوية"} v={event.decision.priority} />
            <Row k={en ? "Policy" : "السياسة"} v={event.decision.policy[lang]} />
            <Row k={en ? "Decision" : "القرار"} v={event.decision.verdict[lang]} tone="text-brand" />
          </>
        );
      case 3:
        return (
          <>
            <Row k={en ? "Task" : "المهمة"} v={event.output.taskRef} tone="text-brand" />
            <Row k={en ? "Action" : "الإجراء"} v={event.output.action[lang]} />
            <Row
              k={en ? "Owner" : "المسؤول"}
              v={`${event.output.owner[lang]} · ${event.output.ownerRole[lang]}`}
            />
            <Row k="WhatsApp" v={en ? "Delivered" : "تم التسليم"} tone="text-brand" />
            <Row k={en ? "Distributor" : "الموزع"} v={event.output.distributor} />
          </>
        );
      case 4:
        return (
          <>
            <Row k="SLA" v={event.output.slaLabel} tone="text-brand" />
            <Row k={en ? "Escalation" : "التصعيد"} v={event.output.escalation[lang]} />
          </>
        );
      default:
        return (
          <>
            <Row k={en ? "Evidence" : "الإثبات"} v={en ? "Shelf photo + stock count" : "صورة الرف + الجرد"} />
            <Row k={en ? "Written back" : "أُعيد إلى"} v="C-Store task log" tone="text-brand" />
            <Row k={en ? "Audit" : "التدقيق"} v={en ? "Immutable log entry" : "سجل غير قابل للتعديل"} />
          </>
        );
    }
  };

  return (
    <div className="grid min-h-0 gap-3.5 xl:grid-cols-[1fr_1.3fr_1fr]">
      <Panel
        step="01"
        kicker={en ? "Input" : "المدخل"}
        title={en ? "What C-Store sent" : "ما أرسله C-Store"}
        icon={<Inbox className="h-4 w-4 text-sky" />}
        tone="border-sky/40 bg-sky/10"
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-sky/25 bg-sky/5 p-3">
            <p className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-sky">
              {en ? "Raw event payload" : "الحدث الخام"}
            </p>
            <Row k="event_id" v={event.id} />
            <Row k="event_type" v={event.type} tone="text-critical" />
            <Row k="store" v={`${event.store.name[lang]} · ${event.store.id}`} />
            <Row k="sku" v={`${event.sku.name[lang]} · ${event.sku.id}`} />
            <Row k="confidence" v={`${event.confidence}%`} tone="text-sky" />
            <Row k="captured_at" v={event.capturedAt} />
          </div>
          <div className="rounded-2xl border border-border/50 bg-panel-raised p-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              <MessageCircle className="h-3 w-3" /> {en ? "Field voice note (AR)" : "ملاحظة صوتية"}
            </p>
            <p dir="rtl" className="text-[12px] leading-relaxed">
              {event.voiceNote}
            </p>
          </div>
          <p className="rounded-2xl border border-dashed border-border/60 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
            {en
              ? "C-Store records the fact only — no priority, no owner, no deadline, no money value."
              : "يسجل C-Store الحقيقة فقط — بلا أولوية أو مسؤول أو موعد نهائي أو قيمة مالية."}
          </p>
        </div>
      </Panel>

      <Panel
        step="02"
        kicker={en ? "Intelligence layer" : "طبقة الذكاء"}
        title={en ? "What O.N.E.Tech did with it" : "ما فعلته O.N.E.Tech بالبيانات"}
        icon={<Brain className="h-4 w-4 text-brand" />}
        tone="border-brand/45 bg-brand/12"
      >
        <div className="space-y-2">
          {STAGES.map((stage, i) => {
            const state = done(i) ? "done" : stageIndex === i ? "active" : "wait";
            const open = expanded === i;
            return (
              <div
                key={stage.key}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  state === "active"
                    ? "border-brand bg-brand/10"
                    : state === "done"
                      ? "border-brand/30 bg-panel-raised"
                      : "border-border/40 bg-panel-raised/40 opacity-50"
                }`}
              >
                <button onClick={() => onToggle(i)} className="flex w-full items-start gap-3 px-3.5 py-3 text-left">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                      state === "done"
                        ? "border-brand/60 bg-brand/20 text-brand"
                        : state === "active"
                          ? "border-brand bg-brand/25 text-brand"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {state === "done" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : state === "active" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold tracking-tight">{stage.title[lang]}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {state === "wait" ? stage.caption[lang] : result(i)}
                    </span>
                  </span>
                </button>
                {open && <div className="border-t border-border/40 px-3.5 py-2.5">{detail(i)}</div>}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        step="03"
        kicker={en ? "Output" : "المخرج"}
        title={en ? "What went back to C-Store" : "ما عاد إلى C-Store"}
        icon={<ClipboardCheck className="h-4 w-4 text-brand" />}
        tone="border-brand/40 bg-brand/10"
      >
        <div className="space-y-2">
          <OutRow
            done={done(3)}
            icon={<ClipboardCheck className="h-3.5 w-3.5" />}
            title={
              en ? `Task ${event.output.taskRef} written into C-Store` : `المهمة ${event.output.taskRef} كُتبت في C-Store`
            }
            detail={`${event.output.action[lang]} · ${event.store.name[lang]}`}
          />
          <OutRow
            done={done(3)}
            icon={<UserCheck className="h-3.5 w-3.5" />}
            title={en ? "Owner assigned automatically" : "تم إسناد المسؤول تلقائيًا"}
            detail={`${event.output.owner[lang]} · ${event.output.ownerRole[lang]}`}
          />
          <OutRow
            done={done(3)}
            icon={<BellRing className="h-3.5 w-3.5" />}
            title={en ? "WhatsApp alert delivered" : "تنبيه واتساب تم تسليمه"}
            detail={en ? "Field agent + supervisor" : "المندوب والمشرف"}
          />
          <OutRow
            done={done(3)}
            icon={<Truck className="h-3.5 w-3.5" />}
            title={en ? "Distributor notified" : "تم إشعار الموزع"}
            detail={`${event.output.distributor} · ${en ? "replenishment queued" : "التعبئة في الطابور"}`}
          />
          <OutRow
            done={done(4)}
            icon={<Timer className="h-3.5 w-3.5" />}
            title={en ? "SLA clock attached" : "ساعة الاتفاقية مرتبطة"}
            detail={`${event.output.slaLabel} · ${event.output.escalation[lang]}`}
          />
          <OutRow
            done={done(5)}
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            title={en ? "Evidence verified & closed" : "تم التحقق والإغلاق"}
            detail={en ? "Shelf photo + stock count approved" : "صورة الرف والجرد معتمدان"}
          />
          <div className="rounded-2xl border border-brand/30 bg-brand/10 p-3">
            <p className="text-[9px] uppercase tracking-[0.2em] text-brand">
              {en ? "Commercial outcome" : "النتيجة التجارية"}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {sar(event.decision.exposurePerDay)}
              <span className="text-[11px] font-normal text-muted-foreground">/{en ? "day protected" : "يوم محمي"}</span>
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-panel-raised px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            C-Store <ArrowRight className="h-3 w-3 text-brand" /> O.N.E.Tech{" "}
            <ArrowRight className="h-3 w-3 text-brand" /> C-Store
          </div>
        </div>
      </Panel>
    </div>
  );
}
