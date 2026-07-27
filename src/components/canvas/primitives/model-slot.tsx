'use client';

import { Component, Suspense, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh, Vector3Tuple } from 'three';
import { getUi } from '@/lib/store';
import { MAX_FRAME_DELTA } from '@/lib/utils';

/** Decoder shipped in `public/draco` — Draco-compressed GLBs load with no CDN. */
const DRACO_PATH = '/draco/';

interface GltfModelProps {
  url: string;
  scale?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  /** Rotations per second while idle. */
  spin?: number;
  castShadow?: boolean;
}

/**
 * Loads a Draco-compressed GLB and prepares it for the scene: shadow flags,
 * frustum culling and a slow idle rotation.
 */
function GltfModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  spin = 0.1,
  castShadow = false,
}: GltfModelProps) {
  const { scene } = useGLTF(url, DRACO_PATH);
  const groupRef = useRef<Group>(null);

  useLayoutEffect(() => {
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = castShadow;
      mesh.frustumCulled = true;
    });
  }, [scene, castShadow]);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group || !spin || getUi().reducedMotion) return;
    group.rotation.y += Math.min(rawDelta, MAX_FRAME_DELTA) * spin;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error) => void;
}

interface BoundaryState {
  failed: boolean;
}

/**
 * Scene-level error boundary.
 *
 * A missing or corrupt GLB must never take the canvas down — the surrounding
 * environment keeps rendering and this slot quietly shows its procedural
 * stand-in instead.
 */
export class SceneErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  override state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error) {
    this.props.onError?.(error);
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[scene] asset failed to load, using fallback:', error.message);
    }
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** A quiet stand-in that keeps the composition intact while a model is absent. */
function ProceduralFallback({ scale = 1 }: { scale?: number }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh || getUi().reducedMotion) return;
    mesh.rotation.y += Math.min(rawDelta, MAX_FRAME_DELTA) * 0.18;
    mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.14;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial
        color="#111827"
        roughness={0.28}
        metalness={0.85}
        emissive="#3B82F6"
        emissiveIntensity={0.2}
        wireframe
      />
    </mesh>
  );
}

export interface ModelSlotProps extends GltfModelProps {
  /** Rendered while loading and if the asset is missing. */
  fallback?: ReactNode;
}

/**
 * Drop-in GLB slot.
 *
 * The repository ships without binary model assets, so by default every slot
 * renders its procedural stand-in. Drop a `.glb` into `public/models/`, point a
 * slot at it, and it takes over with no other change — see `public/models/README.md`.
 */
export function ModelSlot({ fallback, ...props }: ModelSlotProps) {
  const stand = fallback ?? <ProceduralFallback scale={props.scale} />;

  return (
    <group position={props.position} rotation={props.rotation}>
      <SceneErrorBoundary fallback={stand}>
        <Suspense fallback={stand}>
          <GltfModel {...props} position={[0, 0, 0]} rotation={[0, 0, 0]} />
        </Suspense>
      </SceneErrorBoundary>
    </group>
  );
}

/**
 * Warm the cache for a model before the camera reaches it. Safe to call for a
 * file that does not exist — the failure surfaces at the boundary, not here.
 */
export function preloadModel(url: string) {
  useGLTF.preload(url, DRACO_PATH);
}

/** Frees GPU memory for a model that will not be shown again. */
export function disposeModel(url: string) {
  useGLTF.clear(url);
}
