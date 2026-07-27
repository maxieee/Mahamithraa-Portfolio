import { Color } from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';
import { HASH } from './chunks';

/**
 * Animated constellation link. A pulse of energy travels along the tube's
 * length; `uActive` brightens the whole strand when either endpoint is hovered.
 */
export const LinkMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color('#3B82F6'),
    uPulseColor: new Color('#A5F3FC'),
    uOpacity: 0.28,
    uActive: 0,
    uSeed: 0,
    uSpeed: 0.35,
  },
  /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uPulseColor;
    uniform float uOpacity;
    uniform float uActive;
    uniform float uSeed;
    uniform float uSpeed;

    varying vec2 vUv;

    ${HASH}

    void main() {
      float offset = hash11(uSeed) * 6.283;
      float head = fract(uTime * uSpeed + hash11(uSeed + 1.3));

      // Travelling pulse with a trailing tail.
      float d = vUv.x - head;
      d -= floor(d + 0.5); // wrap to -0.5..0.5
      float pulse = smoothstep(0.16, 0.0, abs(d)) * (1.0 - smoothstep(0.0, 0.22, max(d, 0.0)));

      // Taper the strand at both ends so links read as connections, not sticks.
      float taper = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);

      float base = uOpacity * (0.45 + 0.25 * sin(uTime * 0.5 + offset));
      vec3 color = uColor * (1.0 + uActive * 1.6) + uPulseColor * pulse * (1.2 + uActive);
      float alpha = (base + pulse * 0.7 + uActive * 0.25) * taper;

      if (alpha < 0.004) discard;

      gl_FragColor = vec4(color, alpha);
      #include <colorspace_fragment>
    }
  `,
);

extend({ LinkMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    linkMaterial: ThreeElement<typeof LinkMaterial>;
  }
}
