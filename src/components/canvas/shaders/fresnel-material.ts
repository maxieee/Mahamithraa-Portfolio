import { Color } from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';

/**
 * Rim-lit glass. Cheaper than MeshTransmissionMaterial (no render target) and
 * gives the cold edge-glow the design calls for. Used on panels, monoliths,
 * crystals and capsules.
 */
export const FresnelMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color('#0B1220'),
    uRimColor: new Color('#3B82F6'),
    uRimPower: 2.4,
    uRimStrength: 1.0,
    uOpacity: 0.42,
    uHover: 0,
    /** Position of the animated light sweep along local Y, in object space. */
    uSweep: -1,
    uSweepWidth: 0.32,
  },
  /* glsl */ `
    varying vec3 vNormalW;
    varying vec3 vViewDirW;
    varying vec3 vPositionL;

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormalW = normalize(mat3(modelMatrix) * normal);
      vViewDirW = normalize(cameraPosition - worldPosition.xyz);
      vPositionL = position;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  /* glsl */ `
    uniform vec3 uColor;
    uniform vec3 uRimColor;
    uniform float uRimPower;
    uniform float uRimStrength;
    uniform float uOpacity;
    uniform float uHover;
    uniform float uSweep;
    uniform float uSweepWidth;
    uniform float uTime;

    varying vec3 vNormalW;
    varying vec3 vViewDirW;
    varying vec3 vPositionL;

    void main() {
      float facing = clamp(dot(normalize(vNormalW), normalize(vViewDirW)), 0.0, 1.0);
      float rim = pow(1.0 - facing, uRimPower);

      // Light sweep: a soft band travelling up the object on hover.
      float sweep = 1.0 - smoothstep(0.0, uSweepWidth, abs(vPositionL.y - uSweep));
      sweep *= uHover;

      // Very slight breathing so idle objects are never fully static.
      float breathe = 0.94 + 0.06 * sin(uTime * 0.7 + vPositionL.y * 0.6);

      vec3 color = uColor;
      color += uRimColor * rim * uRimStrength * breathe * (1.0 + uHover * 0.9);
      color += uRimColor * sweep * 0.85;

      float alpha = clamp(uOpacity + rim * 0.5 + sweep * 0.32 + uHover * 0.1, 0.0, 1.0);

      gl_FragColor = vec4(color, alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
);

extend({ FresnelMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    fresnelMaterial: ThreeElement<typeof FresnelMaterial>;
  }
}
