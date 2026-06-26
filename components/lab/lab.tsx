"use client";

import * as React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { cn } from "@/lib/utils";
import type { Gender } from "@/lib/data";
import { SECTOR_COLOR, type SGender } from "@/lib/sectors";
import {
  waffles,
  schoolDots,
  movers,
  cityScatter,
  bump,
  LAB_FIRST,
  LAB_LAST,
  type Waffle,
  type SchoolDot,
} from "@/lib/lab";
import { BIG_CITIES } from "@/lib/cities";

const BIG: readonly string[] = BIG_CITIES;

/** distinct color per featured city, matching their order */
const CITY_COLORS = [
  "#f472b6",
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#c084fc",
  "#fb923c",
];
const cityColor = (name: string) =>
  CITY_COLORS[Math.max(0, BIG.indexOf(name)) % CITY_COLORS.length];

const OFFICER = "#fbbf24"; // gold
const EMPTY = "rgba(255,255,255,0.06)";

/* ---------- 1) Waffle: out of 100 youth ---------- */
function WaffleCard({ d }: { d: Waffle }) {
  const color = SECTOR_COLOR[d.sector] ?? "#38bdf8";
  const cells = Array.from({ length: 100 }, (_, i) => {
    if (i < d.officer) return OFFICER;
    if (i < d.combat) return color;
    if (i < d.enlisted) return `${color}55`;
    return EMPTY;
  });
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-bold text-foreground">{d.sector}</span>
        <span className="text-xs text-muted-foreground">מתוך 100 בני נוער</span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {cells.map((c, i) => (
          <div
            key={i}
            className="aspect-square rounded-[3px]"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span className="text-muted-foreground">
          <span className="font-bold text-foreground">{d.enlisted}</span> גויסו
        </span>
        <span style={{ color }}>
          <span className="font-bold">{d.combat}</span> קרביים
        </span>
        <span style={{ color: OFFICER }}>
          <span className="font-bold">{d.officer}</span> קצינים
        </span>
      </div>
    </div>
  );
}

/* ---------- 2) Beeswarm: every school is a dot ---------- */
const W = 880;
const H = 320;
const PAD = 28;
const MID_Y = H / 2;
const R = 3.1;
const STEP = 2 * R + 0.6;

function Beeswarm({ dots }: { dots: SchoolDot[] }) {
  const placed = React.useMemo(() => {
    const buckets = new Map<number, number>();
    return [...dots]
      .sort((a, b) => a.value - b.value)
      .map((d) => {
        const x = PAD + (d.value / 100) * (W - 2 * PAD);
        const key = Math.round(x / STEP);
        const slot = buckets.get(key) ?? 0;
        buckets.set(key, slot + 1);
        // alternate above/below the midline
        const rank = Math.ceil(slot / 2);
        const dir = slot % 2 === 0 ? 1 : -1;
        const y = MID_Y + dir * rank * STEP;
        return { ...d, x, y };
      });
  }, [dots]);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[640px]">
        {/* axis */}
        <line x1={PAD} x2={W - PAD} y1={H - 12} y2={H - 12} stroke="rgba(255,255,255,0.12)" />
        {[0, 25, 50, 75, 100].map((t) => {
          const x = PAD + (t / 100) * (W - 2 * PAD);
          return (
            <g key={t}>
              <line x1={x} x2={x} y1={H - 16} y2={H - 8} stroke="rgba(255,255,255,0.2)" />
              <text x={x} y={H - 20} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle">
                {t}%
              </text>
            </g>
          );
        })}
        {placed.map((d) => (
          <circle
            key={`${d.key}-${d.value}`}
            cx={d.x}
            cy={Math.max(10, Math.min(H - 26, d.y))}
            r={R}
            fill={d.sector ? (SECTOR_COLOR[d.sector] ?? "#94a3b8") : "#64748b"}
            fillOpacity={0.82}
          >
            <title>
              {d.school}
              {d.council ? ` · ${d.council}` : ""} — {d.value}%
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

/* ---------- 3) Biggest movers ---------- */
function Movers({
  risers,
  fallers,
}: {
  risers: ReturnType<typeof movers>;
  fallers: ReturnType<typeof movers>;
}) {
  const Row = ({ m, up }: { m: (typeof risers)[number]; up: boolean }) => (
    <div className="flex items-center gap-3 py-2">
      <span
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-full",
          up ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400",
        )}
      >
        {up ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
      </span>
      <span className="w-28 shrink-0 truncate text-sm text-foreground sm:w-40">
        {m.council}
      </span>
      <span className="flex-1 text-sm text-muted-foreground tabular-nums">
        {m.from}% <span className="opacity-50">→</span> {m.to}%
      </span>
      <span
        className={cn(
          "shrink-0 text-sm font-bold tabular-nums",
          up ? "text-emerald-400" : "text-rose-400",
        )}
      >
        {m.delta > 0 ? "+" : ""}
        {m.delta}
      </span>
    </div>
  );
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <div className="mb-1 text-sm font-medium text-emerald-400">העולות ביותר ⤴</div>
        <div className="divide-y divide-white/5">
          {risers.map((m) => (
            <Row key={m.council} m={m} up />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-medium text-rose-400">היורדות ביותר ⤵</div>
        <div className="divide-y divide-white/5">
          {fallers.map((m) => (
            <Row key={m.council} m={m} up={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 4) Two-armies quadrant scatter ---------- */
const SC_W = 880;
const SC_H = 440;
const SC_PAD = 44;
function QuadrantScatter({ data }: { data: ReturnType<typeof cityScatter> }) {
  const { points, medEnlist, medCombat } = data;
  if (!points.length) return null;
  const xs = points.map((p) => p.enlist);
  const ys = points.map((p) => p.combat);
  const xMin = Math.max(0, Math.floor((Math.min(...xs) - 3) / 5) * 5);
  const xMax = Math.min(100, Math.ceil((Math.max(...xs) + 3) / 5) * 5);
  const yMin = Math.max(0, Math.floor((Math.min(...ys) - 3) / 5) * 5);
  const yMax = Math.min(100, Math.ceil((Math.max(...ys) + 3) / 5) * 5);
  const px = (v: number) =>
    SC_PAD + ((v - xMin) / (xMax - xMin)) * (SC_W - 2 * SC_PAD);
  const py = (v: number) =>
    SC_H - SC_PAD - ((v - yMin) / (yMax - yMin)) * (SC_H - 2 * SC_PAD);
  const rad = (n: number) => 3 + Math.min(8, Math.sqrt(n) * 1.4);
  const mx = px(medEnlist);
  const my = py(medCombat);
  const corner = (
    x: number,
    y: number,
    anchor: "start" | "end",
    text: string,
  ) => (
    <text x={x} y={y} fill="rgba(255,255,255,0.4)" fontSize="12" textAnchor={anchor}>
      {text}
    </text>
  );
  const sorted = [...points].sort((a, b) => Number(a.big) - Number(b.big));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${SC_W} ${SC_H}`} className="h-auto w-full min-w-[640px]">
        {/* median split */}
        <line x1={mx} x2={mx} y1={SC_PAD - 8} y2={SC_H - SC_PAD} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
        <line x1={SC_PAD} x2={SC_W - SC_PAD} y1={my} y2={my} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
        {/* quadrant captions */}
        {corner(SC_W - SC_PAD, SC_PAD, "end", "מגייסת וגם לוחמת")}
        {corner(SC_PAD, SC_PAD, "start", "מעטים מתגייסים — אך לוחמים")}
        {corner(SC_W - SC_PAD, SC_H - SC_PAD + 4, "end", "מתגייסים, פחות קרבי")}
        {/* axis labels */}
        <text x={SC_W / 2} y={SC_H - 6} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
          שיעור גיוס →
        </text>
        <text x={14} y={SC_H / 2} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle" transform={`rotate(-90 14 ${SC_H / 2})`}>
          שיעור קרבי ↑
        </text>
        {sorted.map((p) => (
          <g key={p.council}>
            <circle
              cx={px(p.enlist)}
              cy={py(p.combat)}
              r={rad(p.n)}
              fill={p.big ? "#38bdf8" : "#475569"}
              fillOpacity={p.big ? 0.95 : 0.55}
              stroke={p.big ? "#bae6fd" : "none"}
              strokeWidth={p.big ? 1 : 0}
            >
              <title>
                {p.council} — גיוס {p.enlist}% · קרבי {p.combat}%
              </title>
            </circle>
            {p.big && (
              <text
                x={px(p.enlist)}
                y={py(p.combat) - rad(p.n) - 4}
                fill="rgba(255,255,255,0.85)"
                fontSize="11"
                textAnchor="middle"
              >
                {p.council}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- 5) Bump chart — rank over the years ---------- */
const BP_W = 880;
const BP_H = 360;
const BP_PADX = 64;
const BP_TOP = 22;
const BP_BOT = 34;
function BumpChart({ data }: { data: ReturnType<typeof bump> }) {
  const { years, maxRank, series } = data;
  const x = (year: number) =>
    BP_PADX + (years.indexOf(year) / (years.length - 1)) * (BP_W - 2 * BP_PADX);
  const y = (rank: number) =>
    BP_TOP + ((rank - 1) / Math.max(1, maxRank - 1)) * (BP_H - BP_TOP - BP_BOT);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${BP_W} ${BP_H}`} className="h-auto w-full min-w-[640px]">
        {years.map((yr) => (
          <text key={yr} x={x(yr)} y={BP_H - 12} fill="rgba(255,255,255,0.45)" fontSize="12" textAnchor="middle">
            {yr}
          </text>
        ))}
        {series.map((s) => {
          const pts = s.points.filter((p) => p.rank != null);
          if (!pts.length) return null;
          const color = cityColor(s.council);
          const d = pts
            .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.rank as number)}`)
            .join(" ");
          const last = pts[pts.length - 1];
          return (
            <g key={s.council}>
              <path d={d} fill="none" stroke={color} strokeWidth={2.25} strokeLinejoin="round" />
              {pts.map((p) => (
                <circle key={p.year} cx={x(p.year)} cy={y(p.rank as number)} r={3.5} fill={color}>
                  <title>
                    {s.council} · {p.year} — מקום {p.rank} ({p.value}%)
                  </title>
                </circle>
              ))}
              <text
                x={x(last.year) + 8}
                y={y(last.rank as number) + 4}
                fill={color}
                fontSize="11"
                fontWeight={600}
              >
                {s.council}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Lab() {
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  // These views are pure client-side SVG (no chart lib); render after mount so
  // the SSR HTML and first client paint can't disagree (same gate as ChartContainer).
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const w = React.useMemo(() => waffles(g), [g]);
  const dots = React.useMemo(() => schoolDots(g, "combat"), [g]);
  const scatter = React.useMemo(() => cityScatter(g), [g]);
  const bumpData = React.useMemo(() => bump(g, "combat"), [g]);
  const allMovers = React.useMemo(() => movers(g, "combat"), [g]);
  const risers = allMovers.slice(0, 6);
  const fallers = allMovers.slice(-6).reverse();

  if (!mounted) return <div className="min-h-[480px]" />;

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <GenderToggle value={gender} onChange={setGender} />
      </div>

      {/* 1 — waffle */}
      <Panel>
        <PanelHeader
          title="מתוך 100 בני נוער"
          subtitle="לכל מגזר: מתוך 100 בני נוער — כמה התגייסו, מתוכם כמה שירתו כלוחמים, ומתוכם כמה הגיעו לקצונה. כל ריבוע = בן אדם אחד."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {w.map((d) => (
            <WaffleCard key={d.sector} d={d} />
          ))}
        </div>
      </Panel>

      {/* 2 — beeswarm */}
      <Panel>
        <PanelHeader
          title="אין ׳ישראל אחת׳ — כל בית ספר כנקודה"
          subtitle="שיעור השירות הקרבי בכל בית ספר בשנה האחרונה. כל נקודה היא בית ספר, צבועה לפי מגזר. הריכוז במקום מסוים מראה כמה בתי ספר שם."
        />
        <Beeswarm dots={dots} />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-4 text-sm text-muted-foreground">
          {Object.entries(SECTOR_COLOR).map(([s, c]) => (
            <span key={s} className="flex items-center gap-2">
              <span className="size-3 rounded-full" style={{ background: c }} />
              {s}
            </span>
          ))}
        </div>
      </Panel>

      {/* 3 — two-armies scatter */}
      <Panel>
        <PanelHeader
          title="שתי צבאות באותה מדינה"
          subtitle="כל עיר ממוקמת לפי שיעור הגיוס (אופקי) מול השירות הקרבי (אנכי). הקווים המקווקווים הם החציון — הם מחלקים את המפה לארבעה רבעים. הערים הגדולות מסומנות."
        />
        <QuadrantScatter data={scatter} />
      </Panel>

      {/* 4 — bump chart */}
      <Panel>
        <PanelHeader
          title={`מי טיפס ומי צנח בדירוג? ${LAB_FIRST}–${LAB_LAST}`}
          subtitle="הדירוג של הערים הגדולות בשיעור השירות הקרבי, מתוך כלל הרשויות, בכל שנה. ככל שגבוה יותר — מקום טוב יותר."
        />
        <BumpChart data={bumpData} />
      </Panel>

      {/* 5 — movers */}
      <Panel>
        <PanelHeader
          title={`מי זזה הכי הרבה? ${LAB_FIRST}–${LAB_LAST}`}
          subtitle="הרשויות עם השינוי הגדול ביותר בשיעור השירות הקרבי, מהשנה הראשונה ועד האחרונה (4+ בתי ספר)."
        />
        <Movers risers={risers} fallers={fallers} />
      </Panel>
    </div>
  );
}
