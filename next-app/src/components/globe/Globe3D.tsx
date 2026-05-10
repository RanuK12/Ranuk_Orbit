'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLocale } from 'next-intl';
import { LOCATIONS, VISITED_DOTS } from '@/data/locations';
import { pickLocalized } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { Coords } from '@/types';

const RADIUS = 1.6;

function toVec3({ lat, lng }: Coords, r = RADIUS + 0.01): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return [x, y, z];
}

function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });
  // Procedural earth-ish material — no textures fetched so the component
  // is self-contained and doesn't block LCP on image requests.
  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial color="#0d1e2d" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.05, 64, 64]} />
        <meshBasicMaterial color="#1E6FA4" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

function Pin({ position, color, active, onClick, label }: { position: [number, number, number]; color: string; active?: boolean; onClick?: () => void; label: string }) {
  const [hover, setHover] = useState(false);
  const scale = active || hover ? 1.6 : 1;
  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        scale={scale}
      >
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hover || active ? 1.4 : 0.6} />
      </mesh>
      {/* Label sprite (HTML would require @react-three/drei Html; keep simple) */}
      <mesh visible={false} name={label} />
    </group>
  );
}

export default function Globe3D({ onSelect, activeId }: { onSelect?: (id: string) => void; activeId?: string }) {
  const locale = useLocale() as Locale;
  const pins = useMemo(
    () =>
      LOCATIONS.map((l) => ({
        id: l.id,
        position: toVec3(l.coords),
        color: l.accentColor,
        label: pickLocalized(l.name, locale),
      })),
    [locale]
  );
  const dots = useMemo(
    () =>
      VISITED_DOTS.map((d, i) => ({
        id: `dot-${i}`,
        position: toVec3(d.coords),
        label: pickLocalized(d.name, locale),
      })),
    [locale]
  );

  return (
    <div className="aspect-square w-full max-w-[580px] mx-auto" aria-label="Interactive 3D globe">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 3, 5]} intensity={0.9} color="#F7F7F5" />
        <directionalLight position={[-4, -2, -3]} intensity={0.25} color="#1E6FA4" />
        <Stars radius={40} depth={30} count={1500} factor={3} saturation={0} fade speed={0.5} />
        <EarthSphere />
        {dots.map((d) => (
          <mesh key={d.id} position={d.position}>
            <sphereGeometry args={[0.013, 8, 8]} />
            <meshBasicMaterial color="#8FA8C0" transparent opacity={0.55} />
          </mesh>
        ))}
        {pins.map((p) => (
          <Pin key={p.id} position={p.position} color={p.color} active={p.id === activeId} onClick={() => onSelect?.(p.id)} label={p.label} />
        ))}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} rotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
