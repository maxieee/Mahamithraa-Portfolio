# 3D models

This folder holds `.glb` assets loaded by `<ModelSlot />`.

The repository intentionally ships **no binary model files** — every environment
is built from procedural geometry and shaders, so the site runs at full fidelity
with nothing in here. `<ModelSlot />` renders a procedural stand-in whenever a
model is absent or fails to load, which means dropping a file in never breaks
anything and removing one never leaves a hole.

## Adding a model

1. Compress it. Draco-compressed GLB is expected — the decoder is already
   vendored in `public/draco/`, so no CDN is involved:

   ```bash
   npx gltf-transform optimize input.glb public/models/desk.glb \
     --compress draco \
     --texture-compress webp
   ```

   `gltf-transform optimize` also resizes oversized textures, prunes unused
   nodes and joins compatible meshes. Aim for **under 2 MB** per model.

2. Point a slot at it:

   ```tsx
   import { ModelSlot } from '@/components/canvas/primitives/model-slot';

   <ModelSlot url="/models/desk.glb" scale={1.4} position={[0, -0.8, 0]} spin={0.05} />
   ```

3. Optionally warm the cache before the camera arrives:

   ```tsx
   import { preloadModel } from '@/components/canvas/primitives/model-slot';

   preloadModel('/models/desk.glb');
   ```

## Notes

- Keep models Y-up and roughly 1 unit ≈ 1 metre; the scenes are laid out to that
  scale.
- Bake lighting into textures where you can — the scenes use a lightformer
  environment rather than an HDRI, so heavy PBR materials gain little.
- Files here are served with a one-year immutable cache header (see
  `next.config.ts`), so change the filename when you change the asset.
