import { Color, Vector3 } from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';
import { HASH, SIMPLEX_3D } from './chunks';

/**
 * Ambient particle field. Positions are static in the buffer; all drift,
 * cursor repulsion and twinkle happen on the GPU so the CPU cost is a single
 * uniform update per frame regardless of particle count.
 */
export const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uPointer: new Vector3(0, 0, 0),
    uSize: 9,
    uColorA: new Color('#3B82F6'),
    uColorB: new Color('#67E8F9'),
    uOpacity: 1,
    uDrift: 1,
    uPixelRatio: 1,
  },
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uPointer;
    uniform float uSize;
    uniform float uDrift;
    uniform float uPixelRatio;

    attribute float aScale;
    attribute float aSeed;

    varying float vSeed;
    varying float vDepth;

    ${SIMPLEX_3D}

    void main() {
      vSeed = aSeed;

      vec3 pos = position;

      // Slow organic drift — three octaves at different rates so the field
      // never visibly loops.
      float t = uTime * 0.06 * uDrift;
      pos.x += snoise(vec3(pos.yz * 0.08, t)) * 0.9 * uDrift;
      pos.y += snoise(vec3(pos.xz * 0.07, t + 12.7)) * 1.1 * uDrift;
      pos.z += snoise(vec3(pos.xy * 0.06, t + 41.3)) * 0.7 * uDrift;

      // Cursor pressure: particles ease away from the pointer ray, falling off
      // smoothly so there is no visible boundary.
      vec3 toPointer = pos - uPointer;
      float dist = length(toPointer);
      float influence = smoothstep(7.0, 0.0, dist);
      pos += normalize(toPointer + 0.0001) * influence * 1.6;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vDepth = -mvPosition.z;

      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = uSize * aScale * uPixelRatio * (14.0 / max(vDepth, 0.001));
    }
  `,
  /* glsl */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uOpacity;
    uniform float uTime;

    varying float vSeed;
    varying float vDepth;

    ${HASH}

    void main() {
      // Round, soft-edged sprite without a texture fetch.
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      float alpha = smoothstep(0.5, 0.06, d);
      if (alpha < 0.01) discard;

      float twinkle = 0.65 + 0.35 * sin(uTime * (0.6 + hash11(vSeed) * 1.4) + vSeed * 6.283);
      vec3 color = mix(uColorA, uColorB, hash11(vSeed + 3.7));

      // Fade distant particles into the fog instead of popping at the far plane.
      float depthFade = 1.0 - smoothstep(26.0, 68.0, vDepth);

      gl_FragColor = vec4(color * twinkle, alpha * uOpacity * depthFade * 0.85);
      #include <colorspace_fragment>
    }
  `,
);

extend({ ParticleMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    particleMaterial: ThreeElement<typeof ParticleMaterial>;
  }
}
