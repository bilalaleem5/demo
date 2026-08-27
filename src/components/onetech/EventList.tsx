import { Store as StoreIcon } from "lucide-react";
import { EVENTS, EVENT_LABEL, type DemoEvent, type Lang } from "@/lib/onetech/data";

export function EventList({
  lang,
  selectedId,
  onSelect,
}: {
  lang: Lang;
  selectedId: string;
  onSelect: (e: DemoEvent) => void;
}) {
  const en = lang === "en";
  return (
    <section className="flex min-h-0 flex-col rounded-3xl border border-border/60 bg-panel">
      <header className="border-b border-border/50 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
          {en ? "Source · C-Store" : "المصدر · C-Store"}
        </p>
        <h2 className="mt-1 text-sm font-semibold tracking-tight">
          {en ? "Field signals captured" : "الإشارات الملتقطة من الميدان"}
        </h2>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {en
            ? "Pick a signal to analyse, then run the intelligence layer."
            : "اختر إشارة للتحليل ثم شغّل طبقة الذكاء."}
        </p>
      </header>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {EVENTS.map((e) => {
          const active = e.id === selectedId;
          return (
            <button
              key={e.id}
              onClick={() => onSelect(e)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                active
                  ? "border-brand/70 bg-brand/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--brand)_35%,transparent)]"
                  : "border-border/50 bg-panel-raised hover:border-brand/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">{e.id}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{e.capturedAt}</span>
              </div>
              <p className="mt-1.5 text-[13px] font-semibold leading-tight">{e.sku.name[lang]}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <StoreIcon className="h-3 w-3" />
                {e.store.name[lang]} · {en ? "Tier" : "فئة"} {e.store.tier}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                    e.type === "OOS" ? "bg-critical/15 text-critical" : "bg-border/60 text-muted-foreground"
                  }`}
                >
                  {EVENT_LABEL[e.type][lang]}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {en ? "IR conf." : "الثقة"} {e.confidence}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
