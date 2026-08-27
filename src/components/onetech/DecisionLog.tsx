import { Check, Mail, MessageCircle, Minus, Phone, Bell, Database, Scale, Users } from "lucide-react";
import type { DemoEvent, Lang } from "@/lib/onetech/data";
import { candidatesFor, notificationsFor, rulesFor, timelineFor } from "@/lib/onetech/derive";

const CHANNEL_ICON = {
  WhatsApp: MessageCircle,
  Push: Bell,
  Email: Mail,
  SMS: Phone,
  "C-Store": Database,
} as const;

function Card({
  icon,
  kicker,
  title,
  children,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-panel">
      <header className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-brand/40 bg-brand/10">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{kicker}</p>
          <h2 className="truncate text-[13px] font-semibold tracking-tight">{title}</h2>
        </div>
      </header>
      <div className="flex-1 space-y-2 p-3.5">{children}</div>
    </section>
  );
}

export function DecisionLog({ lang, event }: { lang: Lang; event: DemoEvent }) {
  const en = lang === "en";
  const rules = rulesFor(event);
  const candidates = candidatesFor(event);
  const notifications = notificationsFor(event);
  const timeline = timelineFor(event);
  const matched = rules.filter((r) => r.matched);
  const score = matched.reduce((s, r) => s + r.weight, 0).toFixed(1);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid gap-3.5 xl:grid-cols-3">
        {/* rules */}
        <Card
          icon={<Scale className="h-4 w-4 text-brand" />}
          kicker={en ? "Decision trace" : "أثر القرار"}
          title={en ? "Which rules fired and why" : "أي القواعد تحققت ولماذا"}
        >
          {rules.map((r) => (
            <div
              key={r.id}
              className={`flex items-start gap-2.5 rounded-2xl border p-2.5 ${
                r.matched ? "border-brand/35 bg-brand/8" : "border-border/40 bg-panel-raised/40 opacity-55"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                  r.matched ? "bg-brand/20 text-brand" : "bg-border/60 text-muted-foreground"
                }`}
              >
                {r.matched ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold leading-tight">
                  <span className="mr-1.5 text-muted-foreground tabular-nums">{r.id}</span>
                  {r.label[lang]}
                </p>
                <p className="text-[10.5px] text-muted-foreground">{r.evidence[lang]}</p>
              </div>
              <span className="shrink-0 text-[10px] font-semibold tabular-nums text-muted-foreground">
                +{r.weight.toFixed(1)}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between rounded-2xl border border-brand/30 bg-brand/10 px-3 py-2.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {en ? "Rule score → decision" : "نتيجة القواعد ← القرار"}
            </span>
            <span className="text-[11.5px] font-semibold text-brand">
              {score} · {event.decision.verdict[lang]}
            </span>
          </div>
        </Card>

        {/* assignment */}
        <Card
          icon={<Users className="h-4 w-4 text-brand" />}
          kicker={en ? "Assignment engine" : "محرك الإسناد"}
          title={en ? "Who it was assigned to and why" : "لمن أُسندت المهمة ولماذا"}
        >
          {candidates.map((c) => (
            <div
              key={c.name.en}
              className={`rounded-2xl border p-3 ${
                c.chosen ? "border-brand/50 bg-brand/10" : "border-border/40 bg-panel-raised/40 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[12px] font-semibold">{c.name[lang]}</p>
                <span
                  className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${
                    c.chosen ? "bg-brand/25 text-brand" : "bg-border/60 text-muted-foreground"
                  }`}
                >
                  {c.chosen ? (en ? "Assigned" : "مُسند") : en ? "Not selected" : "غير مختار"}
                </span>
              </div>
              <p className="text-[10.5px] text-muted-foreground">{c.role[lang]}</p>
              <div className="mt-2 grid grid-cols-4 gap-1.5 text-center">
                {[
                  { k: en ? "Distance" : "المسافة", v: `${c.distanceKm} km` },
                  { k: en ? "Open" : "مفتوحة", v: `${c.openTasks}` },
                  { k: en ? "Skill" : "المهارة", v: `${c.skill}%` },
                  { k: en ? "Score" : "النتيجة", v: `${c.score}` },
                ].map((m) => (
                  <div key={m.k} className="rounded-lg border border-border/40 bg-background/40 px-1 py-1">
                    <p className="text-[8.5px] uppercase tracking-wider text-muted-foreground">{m.k}</p>
                    <p className={`text-[11px] font-semibold tabular-nums ${c.chosen ? "text-brand" : ""}`}>{m.v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] leading-snug text-muted-foreground">{c.reason[lang]}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-border/60 px-3 py-2.5 text-[10.5px] leading-relaxed text-muted-foreground">
            {en
              ? "No human dispatcher touched this — the layer picked the owner, set the deadline and armed the escalation."
              : "لم يتدخل أي منسق بشري — الطبقة اختارت المسؤول وحددت الموعد وفعّلت التصعيد."}
          </div>
        </Card>

        {/* notifications */}
        <Card
          icon={<Bell className="h-4 w-4 text-brand" />}
          kicker={en ? "Notification ledger" : "سجل الإشعارات"}
          title={en ? "Who was notified, on what channel" : "من تم إشعاره وعبر أي قناة"}
        >
          {notifications.map((n, i) => {
            const Icon = CHANNEL_ICON[n.channel];
            return (
              <div key={i} className="rounded-2xl border border-border/50 bg-panel-raised/60 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold leading-tight">{n.to[lang]}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{n.role[lang]}</p>
                  </div>
                  <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{n.at}</span>
                </div>
                <p className="mt-2 rounded-xl border border-border/40 bg-background/50 px-2.5 py-2 text-[10.5px] leading-relaxed text-foreground/85">
                  “{n.message[lang]}”
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-brand">
                  <Check className="h-3 w-3" />
                  {n.channel} · {n.status[lang]}
                </p>
              </div>
            );
          })}
        </Card>
      </div>

      {/* end-to-end timeline */}
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-panel px-4 py-4">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-brand">
              {en ? "End-to-end journey" : "الرحلة الكاملة"}
            </p>
            <h2 className="text-[13px] font-semibold tracking-tight">
              {en
                ? "Shelf → C-Store → O.N.E.Tech → people → C-Store"
                : "الرف ← C-Store ← O.N.E.Tech ← الفريق ← C-Store"}
            </h2>
          </div>
          <span className="text-[10.5px] text-muted-foreground">
            {en ? "52 minutes, zero manual dispatch" : "٥٢ دقيقة، بلا إسناد يدوي"}
          </span>
        </div>
        <ol className="grid gap-2.5 md:grid-cols-4 xl:grid-cols-7">
          {timeline.map((s, i) => (
            <li key={i} className="relative rounded-2xl border border-border/50 bg-panel-raised/60 p-3">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                    s.actor === "O.N.E.Tech"
                      ? "bg-brand/20 text-brand"
                      : s.actor === "C-Store"
                        ? "bg-sky/15 text-sky"
                        : "bg-border/70 text-muted-foreground"
                  }`}
                >
                  {s.actor}
                </span>
                <span className="text-[10px] tabular-nums text-muted-foreground">{s.at}</span>
              </div>
              <p className="mt-2 text-[10.5px] leading-snug">{s.text[lang]}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
