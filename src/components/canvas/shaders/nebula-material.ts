import { BackSide, Color } from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';
import { SIMPLEX_3D, SOFT_TONE } from './chunks';

/**
 * The sky dome. Renders on the backside of a large sphere: a graded night
 * gradient, drifting nebula bands and analytically generated stars — no
 * cubemap download, so it costs nothing to load.
 */
export const NebulaMaterial = shaderMaterial(
  {
    uTime: 0,
    uTop: new Color('#050816'),
    uBottom: new Color('#0B1220'),
    uNebulaA: new Color('#1D4ED8'),
    uNebulaB: new Color('#0E7490'),
    uIntensity: 0.5,
    uStarDensity: 1.0,
  },
  /* glsl */ `
    varying vec3 vDirection;

    void main() {
      vDirection = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uTop;
    uniform vec3 uBottom;
    uniform vec3 uNebulaA;
    uniform vec3 uNebulaB;
    uniform float uIntensity;
    uniform float uStarDensity;

    varying vec3 vDirection;

    ${SIMPLEX_3D}
    ${SOFT_TONE}

    // Deterministic star field: quantise the direction into cells and light one
    // point per cell above a threshold.
    float stars(vec3 dir, float density) {
      vec3 cell = floor(dir * 220.0);
      float h = fract(sin(dot(cell, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
      float threshold = 1.0 - 0.0016 * density;
      float star = smoothstep(threshold, 1.0, h);
      float twinkle = 0.6 + 0.4 * sin(uTime * 1.2 + h * 62.83);
      return star * twinkle;
    }

    void main() {
      vec3 dir = normalize(vDirection);

      float vertical = dir.y * 0.5 + 0.5;
      vec3 color = mix(uBottom, uTop, smoothstep(0.0, 0.9, vertical));

      // Two counter-drifting noise layers read as slow volumetric cloud.
      float n1 = snoise(dir * 1.6 + vec3(0.0, 0.0, uTime * 0.012));
      float n2 = snoise(dir * 3.1 - vec3(uTime * 0.008, 0.0, 0.0));
      float clouds = smoothstep(0.05, 0.85, n1 * 0.6 + n2 * 0.4);

      color += mix(uNebulaA, uNebulaB, smoothstep(-0.4, 0.6, n2)) * clouds * uIntensity;
      color += vec3(0.75, 0.85, 1.0) * stars(dir, uStarDensity) * 0.9;

      gl_FragColor = vec4(softTone(color, 1.35), 1.0);
      #include <colorspace_fragment>
    }
  `,
);

extend({ NebulaMaterial });

/**
 * Sky domes are viewed from inside and must never write depth. Spread these
 * onto the material element at the call site.
 */
export const NEBULA_DEFAULTS = { side: BackSide, depthWrite: false } as const;

declare module '@react-three/fiber' {
  interface ThreeElements {
    nebulaMaterial: ThreeElement<typeof NebulaMaterial>;
  }
}
