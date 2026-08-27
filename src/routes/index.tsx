import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Languages, Play, RotateCcw } from "lucide-react";
import logo from "@/assets/onetech-logo.png.asset.json";
import { EventList } from "@/components/onetech/EventList";
import { FlowTrace } from "@/components/onetech/FlowTrace";
import { DecisionLog } from "@/components/onetech/DecisionLog";
import { TaskBoard } from "@/components/onetech/TaskBoard";
import { EVENTS, KPIS, STAGES, type DemoEvent, type Lang, type Task } from "@/lib/onetech/data";

const TITLE = "O.N.E.Tech Intelligence Layer — C-Store Retail Execution Demo";
const DESCRIPTION =
  "Interactive demo showing how the O.N.E.Tech intelligence layer turns raw C-Store field signals into scored decisions, owned tasks, SLA clocks and closed-loop write-backs.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const STAGE_MS = 1100;
const FIRST = EVENTS[0] as DemoEvent;

function Dashboard() {
  const [lang, setLang] = useState<Lang>("en");
  const [event, setEvent] = useState<DemoEvent>(FIRST);
  const [stageIndex, setStageIndex] = useState(STAGES.length); // start fully analysed & static
  const [expanded, setExpanded] = useState<number | null>(2);
  const [running, setRunning] = useState(false);
  const en = lang === "en";

  useEffect(() => {
    if (!running) return;
    if (stageIndex >= STAGES.length) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setStageIndex((s) => s + 1), STAGE_MS);
    return () => clearTimeout(id);
  }, [running, stageIndex]);

  const select = useCallback((e: DemoEvent) => {
    setEvent(e);
    setRunning(false);
    setStageIndex(STAGES.length);
  }, []);

  const simulate = useCallback(() => {
    setStageIndex(0);
    setExpanded(null);
    setRunning(true);
  }, []);

  const newTask: Task | null =
    stageIndex > 3 || stageIndex >= STAGES.length
      ? {
          id: "live",
          taskRef: event.output.taskRef,
          eventId: event.id,
          priority: event.decision.priority,
          sku: event.sku.name,
          store: event.store.name,
          action: event.output.action,
          owner: event.output.owner,
          sla: event.output.slaLabel,
          slaState: event.decision.priority === "CRITICAL" ? "warn" : "ok",
          column: "assigned",
          value: event.decision.exposurePerDay,
        }
      : null;

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3.5 p-4">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/60 bg-panel px-5 py-4">
          <div className="flex items-center gap-3.5">
            <img src={logo.url} alt="O.N.E Tech logo" className="h-11 w-11 rounded-2xl object-cover" />
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight">
                O.N.E<span className="text-brand">.</span>Tech{" "}
                <span className="text-muted-foreground">× C-Store</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {en ? "Retail Execution Intelligence Layer" : "طبقة ذكاء التنفيذ بالتجزئة"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={simulate}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-brand-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              <Play className="h-3.5 w-3.5" />
              {running
                ? en
                  ? "Analysing…"
                  : "جارٍ التحليل…"
                : en
                  ? "Run intelligence layer"
                  : "شغّل طبقة الذكاء"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setStageIndex(STAGES.length);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel-raised px-3 py-2.5 text-xs font-semibold transition-colors hover:border-brand/50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {en ? "Reset" : "إعادة"}
            </button>
            <button
              onClick={() => setLang(en ? "ar" : "en")}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel-raised px-3 py-2.5 text-xs font-semibold transition-colors hover:border-brand/50"
            >
              <Languages className="h-3.5 w-3.5 text-brand" />
              {en ? "EN / AR" : "عربي / EN"}
            </button>
          </div>
        </header>

        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-5">
          {KPIS.map((k) => (
            <div key={k.label.en} className="rounded-3xl border border-border/60 bg-panel px-4 py-3.5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{k.label[lang]}</p>
              <p
                className={`mt-1.5 text-xl font-semibold tabular-nums tracking-tight ${
                  k.tone === "accent" ? "text-brand" : k.tone === "critical" ? "text-critical" : "text-foreground"
                }`}
              >
                {k.value}
              </p>
              <p className="text-[10.5px] text-muted-foreground">{k.sub[lang]}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3.5 xl:grid-cols-[17.5rem_1fr]">
          <EventList lang={lang} selectedId={event.id} onSelect={select} />
          <div className="flex min-w-0 flex-col gap-3.5">
            <FlowTrace
              lang={lang}
              event={event}
              stageIndex={stageIndex}
              expanded={expanded}
              onToggle={(i) => setExpanded(expanded === i ? null : i)}
            />
            {(stageIndex > 3 || stageIndex >= STAGES.length) && <DecisionLog lang={lang} event={event} />}
            <TaskBoard lang={lang} extraTask={newTask} highlightEventId={event.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
