'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload, useProgress } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { setUi } from '@/lib/store';
import { useDeviceProfile } from '@/hooks/use-device-profile';

// Registers every custom shader material with the R3F catalogue.
import './shaders';

import { CameraRig } from './camera-rig';
import { LightingRig } from './lighting-rig';
import { SkyDome } from './sky-dome';
import { ParticleField } from './particle-field';
import { Effects } from './effects';
import { SceneGate } from './scene-gate';

import { LandingScene } from './scenes/landing-scene';
import { AboutScene } from './scenes/about-scene';
import { SkillsScene } from './scenes/skills-scene';
import { ProjectsScene } from './scenes/projects-scene';
import { LeadershipScene } from './scenes/leadership-scene';
import { ExperienceScene } from './scenes/experience-scene';
import { CertificationsScene } from './scenes/certifications-scene';
import { AchievementsScene } from './scenes/achievements-scene';
import { ContactScene } from './scenes/contact-scene';

/** Mirrors drei's asset loading progress into the store for the preloader. */
function LoadTracker() {
  const { progress, total, loaded } = useProgress();

  useEffect(() => {
    setUi({ loadProgress: total === 0 ? 100 : progress });
    if (total > 0 && loaded === total) setUi({ ready: true });
  }, [progress, total, loaded]);

  // Nothing left to wait for on a cold scene with no external assets.
  useEffect(() => {
    const timeout = window.setTimeout(() => setUi({ ready: true, loadProgress: 100 }), 2600);
    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}

/**
 * The single WebGL surface behind the whole site.
 *
 * Every section is an environment placed in one continuous world; the camera
 * rig flies between them on scroll. `SceneGate` keeps only the nearby
 * environments mounted, so cost stays flat no matter how many sections exist.
 */
export function WorldCanvas() {
  const profile = useDeviceProfile();

  return (
    <Canvas
      // Hidden from assistive tech: the canvas is decorative and every piece of
      // content it shows also exists as real text in the DOM overlay.
      aria-hidden="true"
      role="presentation"
      dpr={profile.dpr}
      shadows={profile.shadows}
      gl={{
        antialias: !profile.postProcessing,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 46, near: 0.1, far: 260, position: SECTION_BY_ID.landing.camera }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.matrixWorldAutoUpdate = true;
      }}
      // Pointer events are only needed on interactive objects.
      eventPrefix="client"
    >
      <color attach="background" args={['#050816']} />
      <fogExp2 attach="fog" args={['#050816', 0.0125]} />

      <LoadTracker />
      <CameraRig />

      <Suspense fallback={null}>
        <SkyDome starDensity={profile.quality === 'low' ? 0.6 : 1} />
        <LightingRig shadows={profile.shadows} />

        <ParticleField
          count={profile.particleCount}
          bounds={[68, 30, 78]}
          center={[-4, 0, -50]}
          size={profile.quality === 'low' ? 7 : 9}
          opacity={0.9}
        />

        {(
          [
            ['landing', LandingScene],
            ['about', AboutScene],
            ['skills', SkillsScene],
            ['projects', ProjectsScene],
            ['leadership', LeadershipScene],
            ['experience', ExperienceScene],
            ['certifications', CertificationsScene],
            ['achievements', AchievementsScene],
            ['contact', ContactScene],
          ] as const
        ).map(([id, Scene]) => {
          const section = SECTION_BY_ID[id];
          return (
            <SceneGate
              key={id}
              name={id}
              index={section.index}
              origin={section.origin}
              facing={section.facing}
            >
              <Scene />
            </SceneGate>
          );
        })}

        <Preload all />
      </Suspense>

      {profile.postProcessing ? <Effects /> : null}

      {/* Drops resolution under sustained load, and skips raycasts while the
          camera is moving fast. */}
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
    </Canvas>
  );
}
