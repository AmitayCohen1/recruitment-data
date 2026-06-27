"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Pause, Play } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import { SECTOR_COLOR, type SGender } from "@/lib/sectors";
import type { Gender } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import {
  schoolCloud,
  sectorBars,
  type CloudPoint,
  type SectorBar,
} from "@/lib/lab";

const SLATE = "#64748b";
const sectorColor = (s: string | null) =>
  s ? SECTOR_COLOR[s] ?? SLATE : SLATE;

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
 * 3) school point cloud — the one view that only works in 3D
 * ================================================================== */
const AX = 5;
const ax = (v: number) => (v / 100) * 2 * AX - AX;

function PointCloud({ points }: { points: CloudPoint[] }) {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const [hover, setHover] = React.useState<number | null>(null);
  const t = useT();

  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    points.forEach((p, i) => {
      dummy.position.set(ax(p.enlist), ax(p.combat), ax(p.officer));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, col.set(sectorColor(p.sector)));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    setHover(null);
  }, [points]);

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
      >
        <sphereGeometry args={[0.085, 14, 14]} />
        <meshStandardMaterial roughness={0.45} metalness={0.1} />
      </instancedMesh>

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
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Tip position={[ax(hp.enlist), ax(hp.combat), ax(hp.officer)]}>
            <div className="font-bold text-foreground">{hp.school}</div>
            {hp.council && (
              <div className="text-muted-foreground/70">{hp.council}</div>
            )}
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
        className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900/70 text-foreground backdrop-blur transition hover:bg-zinc-800/80"
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
  const cloud = React.useMemo(() => schoolCloud(g), [g]);

  if (webgl === false) {
    return (
      <Panel>
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t.three.webglError}
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <GenderToggle value={gender} onChange={setGender} />
      </div>

      {/* 1 — 3D grouped bars */}
      <Panel>
        <PanelHeader title={t.three.barTitle} subtitle={t.three.barSubtitle} />
        <SectorLegend locale={locale} />
        {webgl && (
          <Stage camera={[8, 7, 9]} hint={t.three.barHint} t={t}>
            <BarMatrix key={g} bars={bars} t={t} locale={locale} />
          </Stage>
        )}
      </Panel>

      {/* 2 — school point cloud (3D-only bonus) */}
      <Panel>
        <PanelHeader
          title={t.three.cloudTitle}
          subtitle={t.three.cloudSubtitle(cloud.length)}
        />
        <SectorLegend locale={locale} />
        {webgl && (
          <Stage camera={[9, 7, 11]} hint={t.three.cloudHint} t={t}>
            <PointCloud points={cloud} />
          </Stage>
        )}
      </Panel>
    </div>
  );
}
