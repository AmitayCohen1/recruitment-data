"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Pause, Play, X } from "lucide-react";
import { ChartFootnote, ChartHeader, ChartPanel } from "@/components/ui/panel";
import { GenderToggle, MetricTabsS } from "@/components/sectors/controls";
import { SectionSkeleton } from "@/components/ui/skeleton";
import {
  Button,
  FilterChip,
  FilterInput,
  IconButton,
  MenuItem,
} from "@/components/ui/control";
import { cn } from "@/lib/utils";
import { NEUTRAL, type SGender, type SMetric } from "@/lib/sectors";
import { useT } from "@/components/i18n/locale-provider";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Gender } from "@/lib/data";
import { BIG_CITIES, cityColor } from "@/lib/cities";
import {
  cityScatter,
  bump,
  movers,
  bubbleRace,
} from "@/lib/lab";

const BIG: readonly string[] = BIG_CITIES;

/* ---------- Biggest movers ---------- */
function Movers({
  risers,
  fallers,
  t,
}: {
  risers: ReturnType<typeof movers>;
  fallers: ReturnType<typeof movers>;
  t: Dictionary;
}) {
  const Row = ({ m, up }: { m: (typeof risers)[number]; up: boolean }) => (
    <div className="flex items-center gap-2 py-2 sm:gap-3">
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {m.council}
      </span>
      <span
        dir="ltr"
        className="shrink-0 whitespace-nowrap text-xs text-muted-foreground tabular-nums sm:text-sm"
      >
        {m.from}% <span className="opacity-50">→</span> {m.to}%
      </span>
      <span
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
          up ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400",
        )}
      >
        {up ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
      </span>
      <span
        className={cn(
          "w-16 shrink-0 whitespace-nowrap text-end text-sm font-bold tabular-nums",
          up ? "text-emerald-400" : "text-rose-400",
        )}
      >
        {Math.abs(m.delta)} {t.lab.points}
      </span>
    </div>
  );
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <div className="mb-1 text-sm font-medium text-emerald-400">
          {t.lab.risers}
        </div>
        <div className="divide-y divide-white/5">
          {risers.map((m) => (
            <Row key={m.council} m={m} up />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-medium text-rose-400">
          {t.lab.fallers}
        </div>
        <div className="divide-y divide-white/5">
          {fallers.map((m) => (
            <Row key={m.council} m={m} up={false} />
          ))}
        </div>
      </div>
    </div>
  );
}


/* ---------- Bump chart — rank over the years ---------- */
const BP_W = 880;
const BP_H = 360;
const BP_PADX = 64;
const BP_TOP = 22;
const BP_BOT = 34;
function BumpChart({
  data,
  t,
}: {
  data: ReturnType<typeof bump>;
  t: Dictionary;
}) {
  const { years, maxRank, series } = data;
  const x = (year: number) =>
    BP_PADX + (years.indexOf(year) / (years.length - 1)) * (BP_W - 2 * BP_PADX);
  const y = (rank: number) =>
    BP_TOP + ((rank - 1) / Math.max(1, maxRank - 1)) * (BP_H - BP_TOP - BP_BOT);

  // End labels, de-collided vertically (cities often finish at the same rank).
  const endLabels = series
    .flatMap((s) => {
      const pts = s.points.filter((p) => p.rank != null);
      if (!pts.length) return [];
      const last = pts[pts.length - 1];
      return [
        {
          council: s.council,
          color: cityColor(s.council),
          x: x(last.year),
          dotY: y(last.rank as number),
          y: y(last.rank as number),
        },
      ];
    })
    .sort((a, b) => a.dotY - b.dotY);
  const GAP = 15;
  for (let i = 1; i < endLabels.length; i++) {
    if (endLabels[i].y - endLabels[i - 1].y < GAP) {
      endLabels[i].y = endLabels[i - 1].y + GAP;
    }
  }

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
          return (
            <g key={s.council}>
              <path d={d} fill="none" stroke={color} strokeWidth={2.25} strokeLinejoin="round" />
              {pts.map((p) => (
                <circle key={p.year} cx={x(p.year)} cy={y(p.rank as number)} r={3.5} fill={color}>
                  <title>{`${s.council} · ${p.year} — ${t.lab.rank} ${p.rank} (${p.value}%)`}</title>
                </circle>
              ))}
            </g>
          );
        })}
        {endLabels.map((l) => (
          <g key={l.council}>
            {Math.abs(l.y - l.dotY) > 1 && (
              <line x1={l.x} y1={l.dotY} x2={l.x + 6} y2={l.y - 3} stroke={l.color} strokeOpacity={0.4} strokeWidth={1} />
            )}
            <text x={l.x + 9} y={l.y} fill={l.color} fontSize="11" fontWeight={600} dominantBaseline="middle">
              {l.council}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- Bubble race — Gapminder over the years ---------- */
const BR_W = 880;
const BR_H = 470;
const BR_PAD = 48;

/** Advance an index 0..length-1 on a timer while `playing`, looping. */
function useTicker(length: number, playing: boolean, ms = 1150) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!playing || length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % length), ms);
    return () => clearInterval(id);
  }, [playing, length, ms]);
  return [i, setI] as const;
}

function BubbleRace({
  data,
  t,
  featured,
}: {
  data: ReturnType<typeof bubbleRace>;
  t: Dictionary;
  /** cities to spotlight (blue + labeled) — shared with the filter bar */
  featured: Set<string>;
}) {
  const { years, frames, xBounds, yBounds } = data;
  const [playing, setPlaying] = React.useState(true);
  const [idx, setIdx] = useTicker(years.length, playing);
  const frame = frames[idx];
  const [xMin, xMax] = xBounds;
  const [yMin, yMax] = yBounds;
  const px = (v: number) =>
    BR_PAD + ((v - xMin) / (xMax - xMin)) * (BR_W - 2 * BR_PAD);
  const py = (v: number) =>
    BR_H - BR_PAD - ((v - yMin) / (yMax - yMin)) * (BR_H - 2 * BR_PAD);
  const rad = (n: number) => 4 + Math.min(20, Math.sqrt(n) * 2.3);
  const xticks = [xMin, Math.round((xMin + xMax) / 2), xMax];
  const yticks = [yMin, Math.round((yMin + yMax) / 2), yMax];

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <IconButton
          type="button"
          onClick={() => setPlaying((p) => !p)}
          shape="circle"
          className="text-foreground"
          aria-label={playing ? t.lab.racePause : t.lab.racePlay}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </IconButton>
        <input
          type="range"
          min={0}
          max={years.length - 1}
          value={idx}
          onChange={(e) => {
            setPlaying(false);
            setIdx(Number(e.target.value));
          }}
          className="h-1 flex-1 cursor-pointer accent-sky-400"
        />
        <span className="w-12 shrink-0 text-end text-lg font-bold tabular-nums text-foreground">
          {frame.year}
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${BR_W} ${BR_H}`} className="h-auto w-full min-w-[640px]">
          {/* watermark year */}
          <text
            x={BR_W / 2}
            y={BR_H / 2}
            fill="rgba(255,255,255,0.05)"
            fontSize="180"
            fontWeight={800}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {frame.year}
          </text>
          {/* gridlines */}
          {xticks.map((v) => (
            <g key={`x${v}`}>
              <line x1={px(v)} x2={px(v)} y1={BR_PAD - 10} y2={BR_H - BR_PAD} stroke="rgba(255,255,255,0.07)" />
              <text x={px(v)} y={BR_H - BR_PAD + 18} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle">
                {v}%
              </text>
            </g>
          ))}
          {yticks.map((v) => (
            <g key={`y${v}`}>
              <line x1={BR_PAD} x2={BR_W - BR_PAD} y1={py(v)} y2={py(v)} stroke="rgba(255,255,255,0.07)" />
              <text x={BR_PAD - 8} y={py(v) + 4} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="end">
                {v}%
              </text>
            </g>
          ))}
          {frame.points.map((p) => {
            const on = featured.has(p.council);
            return (
              <circle
                key={p.council}
                cx={px(p.x)}
                cy={py(p.y)}
                r={rad(p.n)}
                fill={on ? "#38bdf8" : NEUTRAL}
                fillOpacity={on ? 0.9 : 0.4}
                stroke={on ? "#bae6fd" : "none"}
                strokeWidth={on ? 1 : 0}
                style={{ transition: "cx 800ms ease, cy 800ms ease, r 400ms ease" }}
              >
              <title>{`${p.council} · ${frame.year} — ${t.lab.scatterTip(p.x, p.y)}`}</title>
              </circle>
            );
          })}
          {frame.points
            .filter((p) => featured.has(p.council))
            .map((p) => (
              <text
                key={`l${p.council}`}
                x={px(p.x)}
                y={py(p.y) - rad(p.n) - 4}
                fill="rgba(255,255,255,0.85)"
                fontSize="11"
                textAnchor="middle"
                style={{ transition: "x 800ms ease, y 800ms ease" }}
              >
                {p.council}
              </text>
            ))}
          <text x={BR_W / 2} y={BR_H - 6} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
            {t.lab.axisEnlist}
          </text>
          <text x={14} y={BR_H / 2} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle" transform={`rotate(-90 14 ${BR_H / 2})`}>
            {t.lab.axisCombat}
          </text>
        </svg>
      </div>
    </div>
  );
}


/* ---------- Card header filters: gender · city search ---------- */
function CityFilterBar({
  gender,
  onGender,
  cities,
  featured,
  onToggle,
  onClear,
  t,
}: {
  gender: SGender;
  onGender: (g: SGender) => void;
  cities: string[];
  featured: Set<string>;
  onToggle: (c: string) => void;
  onClear: () => void;
  t: Dictionary;
}) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const matches = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return cities
      .filter((c) => !featured.has(c) && c.toLowerCase().includes(needle))
      .slice(0, 8);
  }, [q, cities, featured]);

  const chips = [...featured].sort((a, b) => a.localeCompare(b, "he"));

  return (
    <div className="w-full space-y-3 sm:min-w-[min(34rem,100%)]">
      <div className="flex flex-wrap items-center gap-3">
        <GenderToggle value={gender} onChange={onGender} surface="city_filter" />

        <div className="relative ms-auto w-full sm:w-64">
          <FilterInput
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={t.cityFilter.add}
            className="w-full"
          />
          {open && q.trim() && (
            <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-xl">
              {matches.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {t.cityFilter.noResults}
                </div>
              ) : (
                matches.map((c) => (
                  <MenuItem
                    key={c}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onToggle(c);
                      setQ("");
                    }}
                  >
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: cityColor(c) }} />
                    <span className="truncate">{c}</span>
                  </MenuItem>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* spotlighted cities as removable chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t.cityFilter.selectedLabel}:</span>
          {chips.map((c) => (
            <FilterChip
              key={c}
              type="button"
              onClick={() => onToggle(c)}
            >
              {c}
              <X className="size-3 text-muted-foreground" />
            </FilterChip>
          ))}
          <Button
            type="button"
            variant="link"
            onClick={onClear}
            className="text-xs"
          >
            {t.cityFilter.clear}
          </Button>
        </div>
      )}
    </div>
  );
}

export function CityBubbleRace() {
  const t = useT();
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const [gender, setGender] = React.useState<SGender>("בנים");
  const [featured, setFeatured] = React.useState<Set<string>>(() => new Set(BIG));

  const g: Gender = gender === "בנים" ? "m" : "f";
  const scatter = React.useMemo(() => cityScatter(g), [g]);
  const race = React.useMemo(() => bubbleRace(g, "enlist", "combat"), [g]);
  const cityNames = React.useMemo(
    () => [...new Set(scatter.points.map((p) => p.council))],
    [scatter],
  );

  const toggleCity = (c: string) =>
    setFeatured((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  const clearCities = () => setFeatured(new Set());

  if (!mounted) return <SectionSkeleton panels={1} />;

  return (
    <ChartPanel>
      <ChartHeader title={t.lab.raceTitle} subtitle={t.lab.raceSubtitle}>
        <CityFilterBar
          gender={gender}
          onGender={setGender}
          cities={cityNames}
          featured={featured}
          onToggle={toggleCity}
          onClear={clearCities}
          t={t}
        />
      </ChartHeader>
      <BubbleRace data={race} t={t} featured={featured} />
      <ChartFootnote>{t.lab.unweightedNote}</ChartFootnote>
    </ChartPanel>
  );
}

/* The city-level charts, gathered onto the Cities tab (moved out of the lab),
 * sharing one header filter cluster (gender + city spotlight) that lights up
 * the city story below. Pure client-side SVG — render after mount so SSR and
 * first client paint agree. */
export function CityCharts() {
  const t = useT();
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const [gender, setGender] = React.useState<SGender>("בנים");
  const [metric, setMetric] = React.useState<SMetric>("combat");
  const g: Gender = gender === "בנים" ? "m" : "f";

  if (!mounted) return <SectionSkeleton panels={2} />;

  return (
    <div className="space-y-8">
      {/* big cities' rank over time — owns the shared gender toggle */}
      <ChartPanel>
        <ChartHeader title={t.lab.bumpTitle} subtitle={t.lab.bumpSubtitle}>
          <GenderToggle value={gender} onChange={setGender} surface="cities" />
        </ChartHeader>
        <BumpChart data={bump(g, "combat")} t={t} />
        <ChartFootnote>{t.lab.unweightedNote}</ChartFootnote>
      </ChartPanel>

      {/* biggest movers */}
      <ChartPanel>
        <ChartHeader title={t.lab.moversTitle} subtitle={t.lab.moversSubtitle}>
          <MetricTabsS value={metric} onChange={setMetric} surface="city_movers" />
        </ChartHeader>
        {(() => {
          const all = movers(g, metric);
          return <Movers risers={all.slice(0, 6)} fallers={all.slice(-6).reverse()} t={t} />;
        })()}
        <ChartFootnote>{t.lab.moversNote}</ChartFootnote>
      </ChartPanel>
    </div>
  );
}
