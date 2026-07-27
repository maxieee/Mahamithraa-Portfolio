# Mahamithraa Gupta — Think. Solve. Lead.

An interactive 3D portfolio. Nine environments laid out in one continuous world;
scrolling flies a camera through them along a spline. Every environment has a
readable DOM counterpart layered over it, so the site is fully usable — and
indexable — without the 3D layer.

```bash
npm install
npm run dev     # http://localhost:3000
```

No environment variables are required to run it.

---

## How it works

### One world, one camera

`src/lib/content/sections.ts` is the spatial spine of the project. Each section
declares where its environment sits in world space and how it wants to be
looked at:

```ts
{
  id: 'projects',
  origin: [30, 1, -82],
  view: { yaw: 35 * DEG, pitch: 5 * DEG, distance: 17, shift: 4.6, lift: 0.5 },
}
```

Camera keyframes are **derived**, not hand-typed:

- `yaw` / `pitch` place the camera on a sphere around the environment. Each yaw
  points back toward the *previous* environment, so the camera always arrives
  facing the way it travelled — that is what makes the transitions read as one
  flight rather than nine cuts.
- `distance` controls how much of the frame the environment fills.
- `shift` slides the look-at target sideways so the environment lands in the
  free right-hand side of the frame, beside the copy panel.
- `turn` (optional) angles an environment away from face-on. The leadership
  bridge needs it: viewed head-on, a line of crystals collapses to a point.

`CameraRig` threads those keyframes onto a `CatmullRomCurve3` and samples it
with `getPoint(t)` — parameter space, so `t = i/(n-1)` lands exactly on
keyframe `i`. (`getPointAt` re-parameterises by arc length and would drift the
camera off its keyframes wherever environment spacing is uneven, which it is by
design.)

### Scroll is anchored to the DOM, not to page height

`SmoothScrollProvider` measures the real `offsetTop` of every section element
and maps scroll position piecewise between those anchors. Deriving progress from
`scrollY / documentHeight` instead would desynchronise the camera from the copy
the moment a footer existed or a section grew past one viewport.

### Two-tier state

`src/lib/store.ts` splits state deliberately:

- **`mutable`** — scroll progress, pointer position, focus blend. Read every
  frame inside `useFrame`, never through React. Moving the mouse costs zero
  renders.
- **`useUi`** — active section, open project, hovered skill. A
  `useSyncExternalStore` selector store, so a component re-renders only when the
  slice it reads actually changes.

### Only three environments exist at once

`SceneGate` mounts an environment only while the camera is within one section of
it, cross-fades the transition, and unmounts to free GPU memory. This is the
main reason cost stays flat as sections are added.

---

## Structure

```
src/
├── app/                        route handlers, metadata, SEO, error boundaries
│   ├── api/contact/route.ts    validated + rate-limited contact endpoint
│   ├── opengraph-image.tsx     social card, generated at request time
│   ├── layout.tsx              metadata, Person JSON-LD, font preload
│   ├── error.tsx               route-level boundary
│   └── global-error.tsx        root-layout boundary
├── components/
│   ├── canvas/
│   │   ├── camera-rig.tsx      spline flight, parallax, roll, focus blend
│   │   ├── scene-gate.tsx      mount/unmount + fade per environment
│   │   ├── lighting-rig.tsx    lightformer environment (no HDRI download)
│   │   ├── particle-field.tsx  GPU-driven ambient dust, one draw call
│   │   ├── sky-dome.tsx        procedural nebula + stars
│   │   ├── effects.tsx         bloom, grain, vignette, SMAA
│   │   ├── shaders/            five custom materials, GLSL as typed modules
│   │   ├── primitives/         glass panel, 3D text, GLB slot
│   │   └── scenes/             the nine environments
│   ├── sections/               the DOM counterpart of each environment
│   ├── layout/                 preloader, nav, rail, cursor, footer
│   ├── providers/              Lenis smooth scroll, pointer tracking
│   └── ui/                     shadcn/ui primitives
├── hooks/                      reduced motion, device profile, magnetic, tilt
├── lib/
│   ├── content/                all copy and data, typed
│   ├── store.ts                two-tier state
│   ├── motion.ts               shared easing tokens
│   └── utils.ts                cn(), damping helpers, frame-delta cap
└── types/
```

---

## Editing content

Everything is typed data — no copy is hard-coded in components.

| What | Where |
| --- | --- |
| Name, headline, tagline, socials, SEO | `src/lib/content/profile.ts` |
| Skill galaxy (nodes, links, orbits) | `src/lib/content/skills.ts` |
| Case studies | `src/lib/content/projects.ts` |
| Milestones, experience, certifications, achievements | `src/lib/content/career.ts` |
| World layout and camera framing | `src/lib/content/sections.ts` |

Adding a skill adds a node to the 3D galaxy, a chip to the DOM panel and an
entry in the `knowsAbout` JSON-LD, all from the one edit.

### Project artwork

`public/images/projects/*.svg` are generated schematics — each one diagrams the
project it fronts. Regenerate with:

```bash
node scripts/generate-placeholders.mjs
```

Drop a real screenshot in at the same path and it is picked up with no code
change.

### 3D models

The repo ships **no binary model assets**; every environment is procedural
geometry and shaders. `<ModelSlot />` renders a stand-in when a model is absent
or fails to load, so adding one never breaks anything and removing one never
leaves a hole. The Draco decoder is vendored in `public/draco/`, so compressed
GLBs load with no CDN involved. See `public/models/README.md`.

---

## Contact form

`POST /api/contact` validates with zod, applies a fixed-window rate limit and
carries a honeypot field.

- With `RESEND_API_KEY` **and** `CONTACT_FROM_EMAIL` set, it delivers the
  message.
- With neither set, it validates and responds `{ ok: true, delivered: false }`,
  and the UI shows a prefilled mailto fallback.

The rate limiter is per-instance and in-memory — deliberate for a low-volume
endpoint. For a multi-region deploy, swap the `hits` map for a shared store; the
call sites do not change.

See `.env.example`.

---

## Performance

- The WebGL bundle is `ssr: false` dynamic — three.js never enters the server
  bundle, and the shell paints before the canvas loads.
- `useDeviceProfile` picks a rendering budget once on mount (DPR, particle
  count, shadows, post-processing) from cores, memory and viewport.
- `AdaptiveDpr` drops resolution under sustained load; `AdaptiveEvents` skips
  raycasts while the camera is moving fast.
- Particles are one draw call; all drift, cursor repulsion and twinkle are in
  the vertex/fragment shaders.
- Constellation links are transformed unit cylinders — no geometry rebuilt per
  frame.
- Per-frame delta is capped at `MAX_FRAME_DELTA` (1/15s). The cap has to sit
  below the slowest frame rate you still want animating correctly: a 1/30 cap
  made everything run in slow motion under 30fps.
- Fonts are self-hosted; the lighting environment is built from lightformers
  rather than a downloaded HDRI. The site renders correctly with no external
  network access at all.

---

## Accessibility

- The canvas is `aria-hidden`. Every piece of content it displays also exists as
  real text in the DOM — the 3D layer is an enhancement, never the only copy.
- Reduced motion is honoured in CSS *and* in the render loop: cameras hold
  still, scenes stop drifting, scroll damping collapses.
- Section navigation works by keyboard (Page Up/Down, Home/End, Escape to back
  out of any detail view). Ordinary arrow-key scrolling and tab order are left
  alone.
- Nav items are real anchors to real section elements, so in-page navigation
  survives with JavaScript disabled.
- Every 3D interaction has a DOM equivalent: skill nodes have chips, monoliths
  have cards, capsules have buttons.
- A directional scrim sits behind each copy column to hold body text above WCAG
  AA contrast over a moving scene.
- If WebGL is unavailable or the renderer dies, an error boundary degrades to a
  static gradient backdrop and the site remains fully readable.

---

## SEO

Metadata, OpenGraph and Twitter cards in `app/layout.tsx`; a generated social
image at `app/opengraph-image.tsx`; `sitemap.xml` and `robots.txt` as route
handlers; and a `schema.org/Person` graph built from the same typed content that
renders the page.

Set `NEXT_PUBLIC_SITE_URL` before deploying so canonical and OG URLs resolve.

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Built with Next.js 15 (App Router), TypeScript (strict), React Three Fiber,
drei, three.js, GSAP, Framer Motion, Lenis, Tailwind CSS, shadcn/ui and Lucide.
