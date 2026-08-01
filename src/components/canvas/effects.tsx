'use client';

import { EffectComposer, Bloom, Vignette, Noise, SMAA } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

/**
 * Post chain, ordered cheapest-last:
 *  - Bloom on the bright rim/glow pass only (high threshold, so nothing blooms
 *    that was not already meant to glow)
 *  - a faint film grain that hides banding in the large dark gradients
 *  - a soft vignette to hold attention centre-frame
 *  - SMAA, since the WebGL context runs without MSAA when post is enabled
 */
export function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.72}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.28}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.16} />
      <Vignette offset={0.28} darkness={0.62} eskil={false} blendFunction={BlendFunction.NORMAL} />
      <SMAA />
    </EffectComposer>
  );
}
