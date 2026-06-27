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
  citySkyline,
  type CloudPoint,
  type SectorBar,
  type Tower,
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
 * 3) 3D skyline — one tower per municipality. Height = combat rate,
 *    footprint = #schools, laid out in a grid ordered by enlistment.
 *    A rotatable "city of recruitment".
 * ================================================================== */
const SKY_MAXH = 6;
const SKY_SP = 1.45; // grid spacing between towers
const SKY_LO = new THREE.Color("#475569");
const SKY_HI = new THREE.Color("#38bdf8");

function Tower3D({
  x,
  z,
  base,
  height,
  color,
  hovered,
  onOver,
  onOut,
}: {
  x: number;
  z: number;
  base: number;
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
    grow.current = Math.min(1, grow.current + dt * 1.6);
    const h = Math.max(0.001, height * easeOut(grow.current));
    m.scale.set(1, h, 1);
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
      <boxGeometry args={[base, 1, base]} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.2}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.04}
      />
    </mesh>
  );
}

function Skyline({ towers, t }: { towers: Tower[]; t: Dictionary }) {
  const [hover, setHover] = React.useState<number | null>(null);

  const { cells, gridSize } = React.useMemo(() => {
    const cols = Math.max(1, Math.ceil(Math.sqrt(towers.length)));
    const rows = Math.ceil(towers.length / cols);
    const maxCombat = Math.max(1, ...towers.map((c) => c.combat));
    const maxN = Math.max(1, ...towers.map((c) => c.n));
    const col = new THREE.Color();
    const cells = towers.map((c, i) => {
      const cx = ((i % cols) - (cols - 1) / 2) * SKY_SP;
      const cz = (Math.floor(i / cols) - (rows - 1) / 2) * SKY_SP;
      const base = 0.45 + 0.65 * Math.sqrt(c.n / maxN);
      const height = (c.combat / 100) * SKY_MAXH;
      col.copy(SKY_LO).lerp(SKY_HI, Math.min(1, c.combat / maxCombat));
      const color = c.big ? "#7dd3fc" : `#${col.getHexString()}`;
      return { tower: c, i, x: cx, z: cz, base, height, color };
    });
    return { cells, gridSize: Math.max(cols, rows) * SKY_SP + 2 };
  }, [towers]);

  const hc = hover != null ? cells[hover] : null;

  return (
    <>
      <gridHelper args={[gridSize, 16, "#ffffff", "#ffffff"]}>
        <lineBasicMaterial transparent opacity={0.06} />
      </gridHelper>

      {cells.map((c) => (
        <Tower3D
          key={c.tower.council}
          x={c.x}
          z={c.z}
          base={c.base}
          height={c.height}
          color={c.color}
          hovered={hover === c.i}
          onOver={() => setHover(c.i)}
          onOut={() => setHover((cur) => (cur === c.i ? null : cur))}
        />
      ))}

      {/* labels for the big cities only, floating above their towers */}
      {cells
        .filter((c) => c.tower.big)
        .map((c) => (
          <Html
            key={`lbl${c.tower.council}`}
            position={[c.x, c.height + 0.35, c.z]}
            center
            className="pointer-events-none"
          >
            <span className="whitespace-nowrap text-[11px] font-semibold text-white/90">
              {c.tower.council}
            </span>
          </Html>
        ))}

      {hc && (
        <Tip position={[hc.x, hc.height + 0.2, hc.z]}>
          <div className="font-bold text-foreground">{hc.tower.council}</div>
          <div dir="ltr" className="mt-0.5 text-muted-foreground tabular-nums">
            {t.three.enlistLabel} {hc.tower.enlist}% · {t.three.combatLabel}{" "}
            {hc.tower.combat}% · {t.three.officerLabel} {hc.tower.officer}%
          </div>
          <div className="text-muted-foreground/70">
            {t.three.schools(hc.tower.n)}
          </div>
        </Tip>
      )}
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
  const locale: Locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const [webgl, setWebgl] = React.useState<boolean | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setWebgl(hasWebGL()), []);

  const bars = React.useMemo(() => sectorBars(g), [g]);
  const cloud = React.useMemo(() => schoolCloud(g, true), [g]);
  const towers = React.useMemo(() => citySkyline(g), [g]);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <GenderToggle value={gender} onChange={setGender} />
      </div>

      {/* 1 — 3D grouped bars */}
      <Panel>
        <PanelHeader title={t.three.barTitle} subtitle={t.three.barSubtitle} />
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

      {/* 2 — 3D school cloud: enlist × combat × officer, colored by sector */}
      <Panel>
        <PanelHeader
          title={t.three.cloudTitle}
          subtitle={t.three.cloudSubtitle(cloud.length)}
        />
        <SectorLegend locale={locale} />
        {webgl === false ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {t.three.webglError}
          </p>
        ) : (
          webgl && <CloudScene points={cloud} />
        )}
      </Panel>

      {/* 3 — 3D skyline: one tower per city (height = combat, base = #schools) */}
      <Panel>
        <PanelHeader title={t.three.skylineTitle} subtitle={t.three.skylineSubtitle} />
        {webgl === false ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {t.three.webglError}
          </p>
        ) : (
          webgl && (
            <Stage camera={[11, 9, 13]} hint={t.three.skylineHint} t={t}>
              <Skyline key={g} towers={towers} t={t} />
            </Stage>
          )
        )}
      </Panel>
    </div>
  );
}
