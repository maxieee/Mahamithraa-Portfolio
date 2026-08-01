'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { PointerProvider } from '@/components/providers/pointer-provider';
import { CanvasMount } from './canvas-mount';
import { Preloader } from './preloader';
import { SiteNav } from './site-nav';
import { ProgressRail } from './progress-rail';
import { CursorGlow } from './cursor-glow';
import { SiteFooter } from './site-footer';
import { KeyboardNavigation } from './keyboard-navigation';

import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { LeadershipSection } from '@/components/sections/leadership-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { CertificationsSection } from '@/components/sections/certifications-section';
import { AchievementsSection } from '@/components/sections/achievements-section';
import { ContactSection } from '@/components/sections/contact-section';

/**
 * Composition root for the whole experience.
 *
 * Layer order, back to front: the fixed WebGL world, the scrolling DOM content
 * that describes it, then the fixed chrome (nav, rail, cursor, preloader).
 */
export function ExperienceShell() {
  return (
    <SmoothScrollProvider>
      <TooltipProvider delayDuration={200} skipDelayDuration={400}>
        <PointerProvider />
        <KeyboardNavigation />

        <CanvasMount />

        <div className="relative z-10">
          <SiteNav />
          <ProgressRail />

          <main id="main">
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <LeadershipSection />
            <ExperienceSection />
            <CertificationsSection />
            <AchievementsSection />
            <ContactSection />
          </main>

          <SiteFooter />
        </div>

        <CursorGlow />
        <Preloader />
      </TooltipProvider>
    </SmoothScrollProvider>
  );
}
