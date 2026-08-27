import { COLUMNS, TASKS, type Lang, type Task } from "@/lib/onetech/data";

const PRIORITY: Record<Task["priority"], string> = {
  CRITICAL: "bg-critical/15 text-critical border-critical/40",
  HIGH: "bg-amber/15 text-amber border-amber/40",
  MEDIUM: "bg-border/60 text-muted-foreground border-border",
};

export function TaskBoard({
  lang,
  extraTask,
  highlightEventId,
}: {
  lang: Lang;
  extraTask: Task | null;
  highlightEventId: string;
}) {
  const en = lang === "en";
  const tasks = extraTask ? [extraTask, ...TASKS] : TASKS;

  return (
    <section className="flex min-h-0 flex-col rounded-3xl border border-border/60 bg-panel">
      <header className="flex items-center justify-between border-b border-border/50 px-5 py-3.5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-brand">
            {en ? "Action CRM" : "إدارة الإجراءات"}
          </p>
          <h2 className="text-[13px] font-semibold tracking-tight">
            {en ? "Every signal now has an owner and a deadline" : "لكل إشارة مسؤول وموعد نهائي"}
          </h2>
        </div>
        <span className="rounded-full border border-border/70 px-3 py-1 text-[10px] text-muted-foreground">
          {tasks.length} {en ? "open records" : "سجل"}
        </span>
      </header>
      <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-3.5 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.column === col.id);
          return (
            <div key={col.id} className="flex min-h-0 flex-col rounded-2xl border border-border/45 bg-panel-raised/50">
              <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {col.label[lang]}
                </span>
                <span className="rounded bg-border/60 px-1.5 text-[10px] tabular-nums">{items.length}</span>
              </div>
              <div className="space-y-2 p-2">
                {items.map((t) => {
                  const on = t.eventId === highlightEventId;
                  return (
                    <article
                      key={t.id}
                      className={`rounded-xl border p-2.5 transition-all ${
                        on ? "border-brand/70 bg-brand/10" : "border-border/50 bg-panel"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{t.taskRef}</span>
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[8.5px] font-semibold tracking-[0.12em] ${PRIORITY[t.priority]}`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12px] font-semibold leading-tight">{t.sku[lang]}</p>
                      <p className="text-[10.5px] text-muted-foreground">{t.store[lang]}</p>
                      <p className="mt-1.5 text-[10.5px] text-muted-foreground">{t.action[lang]}</p>
                      <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1.5">
                        <span className="truncate text-[10px] text-muted-foreground">{t.owner[lang]}</span>
                        <span
                          className={`shrink-0 font-mono text-[10px] ${
                            t.slaState === "warn"
                              ? "text-critical"
                              : t.slaState === "done"
                                ? "text-brand"
                                : "text-muted-foreground"
                          }`}
                        >
                          {t.sla}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
