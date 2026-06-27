"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { Pause, Play, X } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import { SECTOR_COLOR, sectorColor, type SGender } from "@/lib/sectors";
import type { Gender } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import {
  schoolCloud,
  sectorBars,
  type CloudPoint,
  type SectorBar,
} from "@/lib/lab";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------- shared lighting + scene chrome ---------- */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[8, 12, 6]} intensity={1.15} />
      <directionalLight position={[-7, 5, -9]} intensity={0.45} color="#88aaff" />
    </>
  );
}

/** A small, screen-space tooltip pinned to a 3D point. */
function Tip({
  position,
  children,
}: {
  position: [number, number, number];
  children: React.ReactNode;
}) {
  return (
    <Html
      position={position}
      center
      zIndexRange={[100, 0]}
      className="pointer-events-none"
    >
      <div className="-translate-y-8 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 text-xs shadow-xl">
        {children}
      </div>
    </Html>
  );
}

/* ================================================================== *
 * 1) 3D grouped bar chart — sector × {enlist, combat, officer}
 * ================================================================== */
const BAR_MX = 2.4; // spacing between metrics (x)
const BAR_SZ = 2.2; // spacing between sectors (z)
const BAR_MAXH = 6;
type MetricKey3 = "enlist" | "combat" | "officer";

function Bar({
  x,
  z,
  height,
  color,
  hovered,
  onOver,
  onOut,
}: {
  x: number;
  z: number;
  height: number;
  color: string;
  hovered: boolean;
  onOver: () => void;
  onOut: () => void;
}) {
  const ref = React.useRef<THREE.Mesh>(null);
  const grow = React.useRef(0);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    grow.current = Math.min(1, grow.current + dt * 1.8);
    const h = Math.max(0.001, height * easeOut(grow.current));
    m.scale.y = h;
    m.position.y = h / 2;
  });
  return (
    <mesh
      ref={ref}
      position={[x, 0, z]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onOver();
      }}
      onPointerOut={onOut}
    >
      <boxGeometry args={[0.85, 1, 0.85]} />
      <meshStandardMaterial
        color={color}
        roughness={0.45}
        metalness={0.15}
        emissive={color}
        emissiveIntensity={hovered ? 0.35 : 0}
      />
    </mesh>
  );
}

function BarMatrix({
  bars,
  t,
  locale,
}: {
  bars: SectorBar[];
  t: Dictionary;
  locale: Locale;
}) {
  const [hover, setHover] = React.useState<string | null>(null);
  const metrics: { key: MetricKey3; label: string }[] = [
    { key: "enlist", label: t.three.enlistLabel },
    { key: "combat", label: t.three.combatLabel },
    { key: "officer", label: t.three.officerLabel },
  ];
  const x = (mi: number) => (mi - 1) * BAR_MX;
  const z = (si: number) => (si - (bars.length - 1) / 2) * BAR_SZ;
  const h = (v: number) => (v / 100) * BAR_MAXH;
  const gridSize = Math.max(metrics.length * BAR_MX, bars.length * BAR_SZ) + 2;

  return (
    <>
      <gridHelper args={[gridSize, 12, "#ffffff", "#ffffff"]}>
        <lineBasicMaterial transparent opacity={0.07} />
      </gridHelper>

      {bars.map((b, si) =>
        metrics.map((m, mi) => {
          const val = b[m.key];
          const id = `${si}_${mi}`;
          return (
            <group key={id}>
              <Bar
                x={x(mi)}
                z={z(si)}
                height={h(val)}
                color={b.color}
                hovered={hover === id}
                onOver={() => setHover(id)}
                onOut={() => setHover((c) => (c === id ? null : c))}
              />
              <Html
                position={[x(mi), h(val) + 0.32, z(si)]}
                center
                className="pointer-events-none"
              >
                <span className="text-[10px] font-semibold tabular-nums text-white/90">
                  {val}%
                </span>
              </Html>
            </group>
          );
        }),
      )}

      {/* metric labels along the front edge */}
      {metrics.map((m, mi) => (
        <Html
          key={m.key}
          position={[x(mi), 0, z(bars.length - 1) + BAR_SZ * 0.85]}
          center
          className="pointer-events-none"
        >
          <span className="whitespace-nowrap text-[15px] font-semibold text-white">
            {m.label}
          </span>
        </Html>
      ))}

      {/* sector labels along the side */}
      {bars.map((b, si) => (
        <Html
          key={b.sector}
          position={[x(0) - BAR_MX * 0.9, 0, z(si)]}
          center
          className="pointer-events-none"
        >
          <span className="whitespace-nowrap text-[11px] font-medium text-white/70">
            {sectorLabel(b.sector, locale)}
          </span>
        </Html>
      ))}

      {hover &&
        (() => {
          const [si, mi] = hover.split("_").map(Number);
          const b = bars[si];
          const m = metrics[mi];
          const val = b[m.key];
          return (
            <Tip position={[x(mi), h(val) + 0.2, z(si)]}>
              <div className="font-bold text-foreground">
                {sectorLabel(b.sector, locale)}
              </div>
              <div className="text-muted-foreground">
                {m.label}:{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {val}%
                </span>
              </div>
            </Tip>
          );
        })()}
    </>
  );
}


/* ================================================================== *
 * 2) school point cloud — schools in (enlist, combat, officer) space,
 *    all years, searchable + pinnable. Three real axes; orbit to read
 *    the joint distribution, search/pin to trace a school over time.
 * ================================================================== */
const AX = 5;
const ax = (v: number) => (v / 100) * 2 * AX - AX;
const DIM = new THREE.Color("#0b0f17");

type CloudMeta = {
  key: number;
  school: string;
  council: string | null;
  sector: string | null;
};

function PointCloud({
  points,
  highlight,
  hasFilter,
  pinned,
  onTogglePin,
  t,
}: {
  points: CloudPoint[];
  highlight: Set<number>;
  hasFilter: boolean;
  pinned: number[];
  onTogglePin: (key: number) => void;
  t: Dictionary;
}) {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const [hover, setHover] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    points.forEach((p, i) => {
      const on = highlight.has(p.key);
      dummy.position.set(ax(p.enlist), ax(p.combat), ax(p.officer));
      dummy.scale.setScalar(!hasFilter ? 1 : on ? 2 : 0.6);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      col.set(sectorColor(p.sector));
      if (hasFilter && !on) col.lerp(DIM, 0.82);
      mesh.setColorAt(i, col);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    setHover(null);
  }, [points, highlight, hasFilter]);

  // one path per pinned school, tracing its years in 3D, with a name label
  const trails = React.useMemo(() => {
    const byKey = new Map<number, CloudPoint[]>();
    for (const p of points) {
      const a = byKey.get(p.key);
      if (a) a.push(p);
      else byKey.set(p.key, [p]);
    }
    return pinned.flatMap((key) => {
      const ps = byKey.get(key);
      if (!ps || !ps.length) return [];
      const sorted = [...ps].sort((a, b) => a.year - b.year);
      const last = sorted[sorted.length - 1];
      const pts = sorted.map(
        (p) =>
          [ax(p.enlist), ax(p.combat), ax(p.officer)] as [
            number,
            number,
            number,
          ],
      );
      return [{ key, color: sectorColor(last.sector), pts, label: last.school }];
    });
  }, [points, pinned]);

  const hp = hover != null ? points[hover] : null;

  return (
    <>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2 * AX, 2 * AX, 2 * AX)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </lineSegments>

      <instancedMesh
        ref={ref}
        args={[undefined, undefined, points.length]}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (e.instanceId != null) setHover(e.instanceId);
        }}
        onPointerOut={() => setHover(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (e.instanceId != null) onTogglePin(points[e.instanceId].key);
        }}
      >
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial roughness={0.45} metalness={0.1} toneMapped={false} />
      </instancedMesh>

      {trails.map(
        (tr) =>
          tr.pts.length >= 2 && (
            <Line
              key={tr.key}
              points={tr.pts}
              color={tr.color}
              lineWidth={2}
              transparent
              opacity={0.9}
            />
          ),
      )}
      {trails.map((tr) => (
        <Html
          key={`lbl${tr.key}`}
          position={tr.pts[tr.pts.length - 1]}
          center
          className="pointer-events-none"
        >
          <span className="-translate-y-4 whitespace-nowrap rounded bg-zinc-900/85 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow">
            {tr.label}
          </span>
        </Html>
      ))}

      <Html position={[AX + 0.4, -AX, -AX]} center className="pointer-events-none">
        <span className="whitespace-nowrap text-[15px] font-semibold text-white">
          {t.three.axisEnlist}
        </span>
      </Html>
      <Html position={[-AX, AX + 0.4, -AX]} center className="pointer-events-none">
        <span className="whitespace-nowrap text-[15px] font-semibold text-white">
          {t.three.axisCombat}
        </span>
      </Html>
      <Html position={[-AX, -AX, AX + 0.4]} center className="pointer-events-none">
        <span className="whitespace-nowrap text-[15px] font-semibold text-white">
          {t.three.axisOfficer}
        </span>
      </Html>

      {hp && (
        <>
          <mesh position={[ax(hp.enlist), ax(hp.combat), ax(hp.officer)]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Tip position={[ax(hp.enlist), ax(hp.combat), ax(hp.officer)]}>
            <div className="font-bold text-foreground">{hp.school}</div>
            {hp.council && (
              <div className="text-muted-foreground/70">{hp.council}</div>
            )}
            <div className="text-muted-foreground/70">
              {t.three.cloudYearTip(hp.year)}
            </div>
            <div dir="ltr" className="mt-0.5 text-muted-foreground tabular-nums">
              {t.three.enlistLabel} {hp.enlist}% · {t.three.combatLabel}{" "}
              {hp.combat}% · {t.three.officerLabel} {hp.officer}%
            </div>
          </Tip>
        </>
      )}
    </>
  );
}

/** Search + pin controls wrapped around the 3D cloud. Searching highlights
 *  matches; clicking a result (or a dot) pins a school so its dots stay lit
 *  and its years connect into a 3D path. */
function CloudScene({ points }: { points: CloudPoint[] }) {
  const t = useT();
  const [query, setQuery] = React.useState("");
  const [pinned, setPinned] = React.useState<number[]>([]);

  const schools = React.useMemo<CloudMeta[]>(() => {
    const m = new Map<number, CloudMeta>();
    for (const p of points)
      if (!m.has(p.key))
        m.set(p.key, {
          key: p.key,
          school: p.school,
          council: p.council,
          sector: p.sector,
        });
    return [...m.values()];
  }, [points]);

  const q = query.trim();
  const results = React.useMemo(
    () => (q ? schools.filter((s) => s.school.includes(q)).slice(0, 8) : []),
    [q, schools],
  );
  const highlight = React.useMemo(() => {
    const s = new Set<number>(pinned);
    if (q) for (const m of schools) if (m.school.includes(q)) s.add(m.key);
    return s;
  }, [pinned, q, schools]);
  const hasFilter = highlight.size > 0;

  const togglePin = React.useCallback(
    (key: number) =>
      setPinned((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      ),
    [],
  );

  const pinnedSchools = pinned
    .map((k) => schools.find((s) => s.key === k))
    .filter((s): s is CloudMeta => !!s);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="relative w-full sm:max-w-xs">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.three.cloudSearch}
            className="h-9 w-full rounded-lg border border-white/10 bg-white/4 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-white/25 focus:outline-none"
          />
          {q && (
            <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-xl">
              {results.length ? (
                results.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      togglePin(r.key);
                      setQuery("");
                    }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-sm hover:bg-white/10"
                  >
                    <span className="truncate text-foreground">{r.school}</span>
                    {r.council && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {r.council}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {t.three.cloudNoResults}
                </div>
              )}
            </div>
          )}
        </div>
        {pinnedSchools.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pinnedSchools.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => togglePin(s.key)}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium text-white"
                style={{ borderColor: sectorColor(s.sector) }}
              >
                {s.school}
                <X className="size-3" />
              </button>
            ))}
          </div>
        )}
      </div>
      <Stage camera={[9, 7, 11]} hint={t.three.cloudHint} t={t}>
        <PointCloud
          points={points}
          highlight={highlight}
          hasFilter={hasFilter}
          pinned={pinned}
          onTogglePin={togglePin}
          t={t}
        />
      </Stage>
    </div>
  );
}

/* ================================================================== *
 * 3) Density terrain — the enlist×combat plane as ground, height = how
 *    many schools sit at each spot (a smoothed 2D kernel density). The
 *    one 3D view whose vertical axis carries real information.
 * ================================================================== */
const TERR_N = 56; // grid resolution per side
const TERR_SIZE = 10; // world span of the plane (x and z)
const TERR_MAXH = 4.2; // peak height
const TERR_BW = 7; // kernel bandwidth, in rate-% units
const TERR_C0 = new THREE.Color("#0b2a4a"); // valleys (deep)
const TERR_C1 = new THREE.Color("#22d3ee"); // mid slopes
const TERR_C2 = new THREE.Color("#f0f9ff"); // peaks (near-white)

const TERR_WHITE = new THREE.Color("#f0f9ff");

/** Color ramp keyed by `tint`: "main" = navy→cyan→white heat; any hex =
 *  dark→that-sector-color→white. Returns rgb components in 0..1. */
function makeRamp(tint: string): (h: number) => [number, number, number] {
  const c = new THREE.Color();
  if (tint === "main") {
    return (h) => {
      if (h < 0.5) c.copy(TERR_C0).lerp(TERR_C1, h / 0.5);
      else c.copy(TERR_C1).lerp(TERR_C2, (h - 0.5) / 0.5);
      return [c.r, c.g, c.b];
    };
  }
  const base = new THREE.Color(tint);
  const dark = base.clone().multiplyScalar(0.18);
  return (h) => {
    c.copy(dark).lerp(base, Math.min(1, h * 1.15));
    if (h > 0.72) c.lerp(TERR_WHITE, ((h - 0.72) / 0.28) * 0.6);
    return [c.r, c.g, c.b];
  };
}

/** Build a density surface geometry from points over the enlist×combat plane.
 *  Height is the smoothed school count, normalized to this set's own max. */
function buildDensityGeometry(
  points: { enlist: number; combat: number }[],
  size: number,
  maxH: number,
  colorAt: (h: number) => [number, number, number],
): THREE.BufferGeometry {
  const n = TERR_N;
  const field = new Float32Array(n * n);
  const inv = 1 / (2 * TERR_BW * TERR_BW);
  for (let gy = 0; gy < n; gy++) {
    const cy = (gy / (n - 1)) * 100;
    for (let gx = 0; gx < n; gx++) {
      const cx = (gx / (n - 1)) * 100;
      let s = 0;
      for (const p of points) {
        const dx = p.enlist - cx;
        const dy = p.combat - cy;
        s += Math.exp(-(dx * dx + dy * dy) * inv);
      }
      field[gy * n + gx] = s;
    }
  }
  const max = Math.max(1, ...field);
  const g = new THREE.PlaneGeometry(size, size, n - 1, n - 1);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const h = field[i] / max;
    pos.setY(i, h * maxH);
    const [r, gg, b] = colorAt(h);
    colors[i * 3] = r;
    colors[i * 3 + 1] = gg;
    colors[i * 3 + 2] = b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** A single rising density surface (lit mesh + faint wireframe), reused by
 *  every terrain variant. Owns its own grow-from-flat reveal. */
function TerrainSurface({
  points,
  tint = "main",
  size = TERR_SIZE,
  maxH = TERR_MAXH,
  opacity = 1,
}: {
  points: { enlist: number; combat: number }[];
  tint?: string;
  size?: number;
  maxH?: number;
  opacity?: number;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  const grow = React.useRef(0);
  const geometry = React.useMemo(
    () => buildDensityGeometry(points, size, maxH, makeRamp(tint)),
    [points, size, maxH, tint],
  );
  React.useEffect(() => {
    grow.current = 0;
  }, [geometry]);
  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    grow.current = Math.min(1, grow.current + dt * 1.4);
    g.scale.y = Math.max(0.001, easeOut(grow.current));
  });
  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.6}
          metalness={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial wireframe transparent opacity={0.07 * opacity} color="#ffffff" />
      </mesh>
    </group>
  );
}

function DensityLegend({ t }: { t: Dictionary }) {
  return (
    <div className="-mt-2 mb-3 flex items-center gap-2 text-sm text-muted-foreground">
      <span>{t.three.densityLow}</span>
      <span
        className="h-2 w-28 rounded-full"
        style={{ background: "linear-gradient(90deg,#0b2a4a,#22d3ee,#f0f9ff)" }}
      />
      <span>{t.three.densityHigh}</span>
    </div>
  );
}

/** group points by sector (latest-year cloud), tagged points only */
function groupBySector(points: CloudPoint[]): Map<string, CloudPoint[]> {
  const m = new Map<string, CloudPoint[]>();
  for (const p of points) {
    if (!p.sector) continue;
    let a = m.get(p.sector);
    if (!a) m.set(p.sector, (a = []));
    a.push(p);
  }
  return m;
}

/** The most common (enlist, combat) combination — the surface's tallest spot.
 *  Coarse argmax over the same kernel, so the peak callout lands on the peak. */
function peakCombo(points: CloudPoint[]): { enlist: number; combat: number } {
  const n = 40;
  const inv = 1 / (2 * TERR_BW * TERR_BW);
  let best = -1;
  let be = 50;
  let bc = 50;
  for (let gy = 0; gy < n; gy++) {
    const cy = (gy / (n - 1)) * 100;
    for (let gx = 0; gx < n; gx++) {
      const cx = (gx / (n - 1)) * 100;
      let s = 0;
      for (const p of points) {
        const dx = p.enlist - cx;
        const dy = p.combat - cy;
        s += Math.exp(-(dx * dx + dy * dy) * inv);
      }
      if (s > best) {
        best = s;
        be = cx;
        bc = cy;
      }
    }
  }
  return { enlist: Math.round(be), combat: Math.round(bc) };
}

const TERR_TICKS = [0, 50, 100];

/* Combined hero terrain (all schools): axis titles, floor tick numbers, and a
 * callout pinned to the tallest spot so the peak explains itself. */
function DensityTerrain({ points, t }: { points: CloudPoint[]; t: Dictionary }) {
  const half = TERR_SIZE / 2;
  const fx = (e: number) => -half + (e / 100) * TERR_SIZE;
  const fz = (c: number) => -half + (c / 100) * TERR_SIZE;
  const peak = React.useMemo(() => peakCombo(points), [points]);
  return (
    <>
      <gridHelper args={[TERR_SIZE + 1.5, 18, "#ffffff", "#ffffff"]}>
        <lineBasicMaterial transparent opacity={0.05} />
      </gridHelper>
      <TerrainSurface points={points} tint="main" />

      {/* axis titles */}
      <Html position={[half + 0.9, 0.1, 0]} center className="pointer-events-none">
        <span className="whitespace-nowrap text-[15px] font-semibold text-white">
          {t.three.enlistLabel} →
        </span>
      </Html>
      <Html position={[0, 0.1, half + 0.9]} center className="pointer-events-none">
        <span className="whitespace-nowrap text-[15px] font-semibold text-white">
          {t.three.combatLabel} →
        </span>
      </Html>

      {/* floor tick numbers anchor the two rate axes */}
      {TERR_TICKS.map((v) => (
        <Html
          key={`ex${v}`}
          position={[fx(v), 0.02, -half - 0.5]}
          center
          className="pointer-events-none"
        >
          <span className="whitespace-nowrap text-[10px] tabular-nums text-white/45">
            {v}%
          </span>
        </Html>
      ))}
      {TERR_TICKS.map((v) => (
        <Html
          key={`cz${v}`}
          position={[-half - 0.5, 0.02, fz(v)]}
          center
          className="pointer-events-none"
        >
          <span className="whitespace-nowrap text-[10px] tabular-nums text-white/45">
            {v}%
          </span>
        </Html>
      ))}

      {/* callout pinned to the tallest spot — what the mountain means */}
      <mesh position={[fx(peak.enlist), TERR_MAXH, fz(peak.combat)]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Html
        position={[fx(peak.enlist), TERR_MAXH + 0.15, fz(peak.combat)]}
        center
        className="pointer-events-none"
      >
        <div className="-translate-y-6 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 text-xs shadow-xl">
          <div className="font-bold text-foreground">{t.three.terrainPeakLabel}</div>
          <div dir="ltr" className="mt-0.5 text-muted-foreground tabular-nums">
            {t.three.enlistLabel} ~{peak.enlist}% · {t.three.combatLabel} ~{peak.combat}%
          </div>
        </div>
      </Html>
    </>
  );
}

/* Floor ticks (0/50/100%) + enlist/combat axis labels for one square plane,
 * so peak positions are readable. Reused by the sector tiles and the overlay. */
function PlaneAxes({ size, t, small = false }: { size: number; t: Dictionary; small?: boolean }) {
  const h = size / 2;
  const fx = (e: number) => -h + (e / 100) * size;
  const fz = (c: number) => -h + (c / 100) * size;
  const tickCls = small ? "text-[9px]" : "text-[10px]";
  const axisCls = small ? "text-[10px]" : "text-[14px]";
  return (
    <>
      {[0, 50, 100].map((v) => (
        <Html key={`ex${v}`} position={[fx(v), 0.02, -h - 0.4]} center className="pointer-events-none">
          <span className={`tabular-nums text-white/40 ${tickCls}`}>{v}</span>
        </Html>
      ))}
      {[0, 50, 100].map((v) => (
        <Html key={`cz${v}`} position={[-h - 0.4, 0.02, fz(v)]} center className="pointer-events-none">
          <span className={`tabular-nums text-white/40 ${tickCls}`}>{v}</span>
        </Html>
      ))}
      <Html position={[h + 0.6, 0.05, -h - 0.4]} center className="pointer-events-none">
        <span className={`whitespace-nowrap font-semibold text-white/80 ${axisCls}`}>
          {t.three.enlistLabel} →
        </span>
      </Html>
      <Html position={[-h - 0.4, 0.05, h + 0.6]} center className="pointer-events-none">
        <span className={`whitespace-nowrap font-semibold text-white/80 ${axisCls}`}>
          {t.three.combatLabel} →
        </span>
      </Html>
    </>
  );
}

/* VARIANT A — four small sector landscapes in a 2×2 grid, one shared scene. */
const TILE = 5.2;
const TILE_GAP = 0.9;
function SectorTerrains({ points, t }: { points: CloudPoint[]; t: Dictionary }) {
  const locale: Locale = useLocale();
  const bySector = React.useMemo(() => groupBySector(points), [points]);
  const sectors = Object.entries(SECTOR_COLOR);
  const off = (TILE + TILE_GAP) / 2;
  const spots: [number, number][] = [
    [-off, -off],
    [off, -off],
    [-off, off],
    [off, off],
  ];
  return (
    <>
      {sectors.map(([name, color], i) => {
        const [ox, oz] = spots[i] ?? [0, 0];
        return (
          <group key={name} position={[ox, 0, oz]}>
            <TerrainSurface
              points={bySector.get(name) ?? []}
              tint={color}
              size={TILE}
              maxH={2.6}
            />
            <PlaneAxes size={TILE} t={t} small />
            <Html position={[0, 3.0, 0]} center className="pointer-events-none">
              <span className="whitespace-nowrap rounded bg-zinc-900/70 px-1.5 py-0.5 text-[12px] font-semibold text-white">
                {sectorLabel(name, locale)}
              </span>
            </Html>
          </group>
        );
      })}
    </>
  );
}

/* Sector breakdown panel — a toggle between "side by side" (a small landscape
 * per sector) and "together" (all four overlaid, translucent). Each mode gets
 * its own Stage (keyed) so the camera framing fits that layout. */
function SectorTerrainPanel({ points, t }: { points: CloudPoint[]; t: Dictionary }) {
  const locale: Locale = useLocale();
  const [mode, setMode] = React.useState<"grid" | "overlay">("grid");
  const tab = (active: boolean) =>
    `rounded-md px-3 py-1 text-sm font-medium transition ${
      active ? "bg-white/15 text-white" : "text-muted-foreground hover:text-foreground"
    }`;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          <button type="button" onClick={() => setMode("grid")} className={tab(mode === "grid")}>
            {t.three.terrainViewGrid}
          </button>
          <button type="button" onClick={() => setMode("overlay")} className={tab(mode === "overlay")}>
            {t.three.terrainViewOverlay}
          </button>
        </div>
        <SectorLegend locale={locale} />
      </div>
      {mode === "grid" ? (
        <Stage key="grid" camera={[2, 16, 15]} hint={t.three.terrainHint} t={t}>
          <SectorTerrains points={points} t={t} />
        </Stage>
      ) : (
        <Stage key="overlay" camera={[9, 8, 11]} hint={t.three.terrainHint} t={t}>
          <OverlayTerrains points={points} t={t} />
        </Stage>
      )}
    </div>
  );
}

/* VARIANT C — all four sector surfaces overlaid, translucent. */
function OverlayTerrains({ points, t }: { points: CloudPoint[]; t: Dictionary }) {
  const bySector = React.useMemo(() => groupBySector(points), [points]);
  return (
    <>
      <gridHelper args={[TERR_SIZE + 1.5, 18, "#ffffff", "#ffffff"]}>
        <lineBasicMaterial transparent opacity={0.05} />
      </gridHelper>
      {Object.entries(SECTOR_COLOR).map(([name, color]) => (
        <TerrainSurface key={name} points={bySector.get(name) ?? []} tint={color} opacity={0.5} />
      ))}
      <PlaneAxes size={TERR_SIZE} t={t} />
    </>
  );
}

/* ---------- stage shell: canvas + auto-rotate toggle + hint ---------- */
function Stage({
  camera,
  hint,
  t,
  children,
}: {
  camera: [number, number, number];
  hint: string;
  t: Dictionary;
  children: React.ReactNode;
}) {
  const [rotate, setRotate] = React.useState(true);
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 sm:h-[520px]">
      <Canvas
        className="absolute inset-0 h-full w-full"
        style={{ width: "100%", height: "100%" }}
        camera={{ position: camera, fov: 45 }}
        // preserveDrawingBuffer keeps the last rendered frame readable so the
        // PNG export (html-to-image → canvas.toDataURL) captures the scene
        // instead of a cleared/black buffer.
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <Lights />
        {children}
        <OrbitControls
          makeDefault
          enableDamping
          enablePan={false}
          autoRotate={rotate}
          autoRotateSpeed={0.5}
          minDistance={6}
          maxDistance={32}
        />
      </Canvas>

      <button
        type="button"
        onClick={() => setRotate((r) => !r)}
        aria-label={rotate ? t.lab.racePause : t.lab.racePlay}
        className="absolute inset-e-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900/70 text-foreground backdrop-blur transition hover:bg-zinc-800/80"
      >
        {rotate ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/40 to-transparent px-3 py-2 text-center text-[11px] text-muted-foreground/80">
        {hint}
      </div>
    </div>
  );
}

/* ---------- root ---------- */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function SectorLegend({ locale }: { locale: Locale }) {
  return (
    <div className="-mt-2 mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
      {Object.entries(SECTOR_COLOR).map(([s, c]) => (
        <span key={s} className="flex items-center gap-2">
          <span className="size-3 rounded-full" style={{ background: c }} />
          {sectorLabel(s, locale)}
        </span>
      ))}
    </div>
  );
}

export function ThreeScenes() {
  const t = useT();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const [webgl, setWebgl] = React.useState<boolean | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setWebgl(hasWebGL()), []);

  const terrain = React.useMemo(() => schoolCloud(g), [g]); // latest year only

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <GenderToggle value={gender} onChange={setGender} />
      </div>

      {/* 3 — density terrain (all schools): height = #schools at each enlist×combat mix */}
      <Panel>
        <PanelHeader title={t.three.terrainTitle} subtitle={t.three.terrainSubtitle} />
        <DensityLegend t={t} />
        {webgl === false ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {t.three.webglError}
          </p>
        ) : (
          webgl && (
            <Stage camera={[9, 8, 11]} hint={t.three.terrainHint} t={t}>
              <DensityTerrain key={g} points={terrain} t={t} />
            </Stage>
          )
        )}
      </Panel>

      {/* 4 — same terrain split by sector: toggle side-by-side / together */}
      <Panel>
        <PanelHeader
          title={t.three.sectorTerrainTitle}
          subtitle={t.three.sectorTerrainSubtitle}
        />
        <DensityLegend t={t} />
        {webgl === false ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {t.three.webglError}
          </p>
        ) : (
          webgl && <SectorTerrainPanel key={g} points={terrain} t={t} />
        )}
      </Panel>
    </div>
  );
}

/** Standalone 3D school point cloud (enlist × combat × officer), for the
 *  Schools tab. Self-contained: owns its gender toggle, WebGL gate and the
 *  cloud's built-in search/pin. Loaded client-only via the wrapper. */
export function SchoolCloudScene() {
  const t = useT();
  const locale: Locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const [webgl, setWebgl] = React.useState<boolean | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setWebgl(hasWebGL()), []);

  const cloud = React.useMemo(() => schoolCloud(g, true), [g]);

  return (
    <Panel>
      <PanelHeader
        title={t.three.cloudTitle}
        subtitle={t.three.cloudSubtitle(cloud.length)}
      >
        <GenderToggle value={gender} onChange={setGender} />
      </PanelHeader>
      <SectorLegend locale={locale} />
      {webgl === false ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t.three.webglError}
        </p>
      ) : (
        webgl && <CloudScene points={cloud} />
      )}
    </Panel>
  );
}

/** Standalone 3D grouped bars — enlistment / combat / officer rates per sector.
 *  Lives on the Overview tab. Self-contained: owns its gender toggle and WebGL
 *  gate. Loaded client-only via the wrapper. */
export function SectorBarsScene() {
  const t = useT();
  const locale: Locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const [webgl, setWebgl] = React.useState<boolean | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setWebgl(hasWebGL()), []);

  const bars = React.useMemo(() => sectorBars(g), [g]);

  return (
    <Panel>
      <PanelHeader title={t.three.barTitle} subtitle={t.three.barSubtitle}>
        <GenderToggle value={gender} onChange={setGender} />
      </PanelHeader>
      <SectorLegend locale={locale} />
      {webgl === false ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t.three.webglError}
        </p>
      ) : (
        webgl && (
          <Stage camera={[8, 7, 9]} hint={t.three.barHint} t={t}>
            <BarMatrix key={g} bars={bars} t={t} locale={locale} />
          </Stage>
        )
      )}
    </Panel>
  );
}
