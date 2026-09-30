import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import type { Group } from 'three';

function Orbiters() {
  const group = useRef<Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={group}>
      <Float speed={2} floatIntensity={1.2} position={[2.1, 0.9, 0]}>
        <mesh>
          <torusGeometry args={[0.32, 0.12, 16, 40]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>
      </Float>
      <Float speed={2.4} floatIntensity={1} position={[-2, -0.8, 0.4]}>
        <mesh>
          <octahedronGeometry args={[0.38]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.25} />
        </mesh>
      </Float>
      <Float speed={1.8} floatIntensity={1.4} position={[0.4, -1.8, 0.8]}>
        <mesh>
          <icosahedronGeometry args={[0.26]} />
          <meshStandardMaterial color="#f472b6" roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

/** Escena ligera: 4 mallas, sin texturas ni post-procesado. Se carga en un chunk aparte. */
export default function Hero3D({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      aria-hidden
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh>
          <sphereGeometry args={[1.35, 64, 64]} />
          <MeshDistortMaterial color="#6366f1" distort={0.35} speed={1.6} roughness={0.15} metalness={0.1} />
        </mesh>
      </Float>
      <Orbiters />
    </Canvas>
  );
}
