import { Color } from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';

/**
 * Infinite-feeling floor grid with a travelling scan line. Analytically
 * anti-aliased with fwidth so the lines stay crisp at grazing angles instead
 * of shimmering.
 */
export const FloorGridMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color('#3B82F6'),
    uGlowColor: new Color('#67E8F9'),
    uScale: 2.0,
    uThickness: 0.012,
    uFade: 34.0,
    uOpacity: 0.5,
    uScanSpeed: 0.5,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPositionL;

    void main() {
      vUv = uv;
      vPositionL = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    uniform float uScale;
    uniform float uThickness;
    uniform float uFade;
    uniform float uOpacity;
    uniform float uScanSpeed;

    varying vec2 vUv;
    varying vec3 vPositionL;

    float gridLine(vec2 p, float thickness) {
      vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p);
      float line = min(grid.x, grid.y);
      return 1.0 - smoothstep(thickness, thickness + 1.0, line);
    }

    void main() {
      vec2 coord = vPositionL.xy / uScale;

      float fine = gridLine(coord, 0.6);
      float coarse = gridLine(coord * 0.2, 1.1);

      // Radial fade so the plane dissolves into fog rather than ending.
      float dist = length(vPositionL.xy);
      float fade = 1.0 - smoothstep(uFade * 0.25, uFade, dist);

      // A slow band of light travelling outward from the centre. It only ever
      // brightens existing grid lines — adding it to empty cells produced hard
      // diagonal streaks wherever the plane was seen at a grazing angle.
      float scan = sin(dist * 0.24 - uTime * uScanSpeed);
      scan = smoothstep(0.9, 1.0, scan) * fade;

      vec3 color = uColor * fine * 0.5 + uColor * coarse * 0.9;
      color += uGlowColor * scan * (fine + coarse) * 0.9;

      float alpha = (fine * 0.45 + coarse * 0.7) * (1.0 + scan * 0.5) * fade * uOpacity;
      if (alpha < 0.002) discard;

      gl_FragColor = vec4(color, alpha);
      #include <colorspace_fragment>
    }
  `,
);

extend({ FloorGridMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    floorGridMaterial: ThreeElement<typeof FloorGridMaterial>;
  }
}
