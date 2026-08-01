'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS, PROJECT_BY_ID } from '@/lib/content/projects';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { setUi, useUi } from '@/lib/store';
import { releaseCamera } from '@/components/canvas/camera-focus';
import { POWER3_OUT } from '@/lib/motion';
import { useTilt } from '@/hooks/use-tilt';
import { SectionShell } from './section-shell';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Project } from '@/types';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>(4);

  const open = useCallback(() => {
    setUi({ openProject: project.id });
  }, [project.id]);

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: POWER3_OUT, delay: index * 0.06 }}
    >
      {/*
        Deliberately compact. The monolith gallery behind this panel is the
        section's visual — a full-bleed image card per project would cover it
        and push the grid past the fold. The artwork gets its full size in the
        case-study dialog instead.
      */}
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="group glass relative flex w-full items-start gap-5 overflow-hidden rounded-2xl p-5 text-left transition-[border-color,box-shadow] duration-500 ease-power3 hover:border-accent/40 hover:shadow-accent-glow"
      >
        {/* Light sweep on hover, mirroring the 3D monolith behaviour. */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-accent-sweep transition-transform duration-1000 ease-power4 group-hover:translate-x-0" />

        <span className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-hairline">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="80px"
            className="object-cover transition-transform duration-700 ease-power4 group-hover:scale-110"
            loading="lazy"
          />
        </span>

        <span className="relative flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-baseline gap-3">
            <span className="font-mono text-xs tabular-nums text-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-base font-semibold leading-snug text-white">
              {project.title}
            </span>
          </span>

          <span className="text-meta text-muted">{project.subtitle}</span>

          <span className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{project.discipline}</Badge>
            <Badge>{project.year}</Badge>
          </span>
        </span>

        <ArrowUpRight
          aria-hidden="true"
          className="relative mt-1 size-4 shrink-0 text-muted transition-all duration-300 ease-power3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </button>
    </motion.div>
  );
}

/** Case study modal — the DOM counterpart of the camera flying to a monolith. */
function CaseStudy() {
  const openProject = useUi((s) => s.openProject);
  const project = openProject ? PROJECT_BY_ID[openProject] : undefined;

  const onOpenChange = useCallback((next: boolean) => {
    if (!next) {
      setUi({ openProject: null });
      releaseCamera();
    }
  }, []);

  return (
    <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
      <DialogContent>
        {project ? (
          <article>
            <DialogHeader>
              <p className="text-eyebrow uppercase text-accent">
                {project.discipline} &middot; {project.year}
              </p>
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>{project.subtitle}</DialogDescription>
            </DialogHeader>

            <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-xl border border-hairline">
              <Image
                src={project.image}
                alt={`Schematic diagram representing ${project.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
              />
            </div>

            <dl className="mt-8 flex flex-col gap-7">
              <div>
                <dt className="text-eyebrow uppercase text-muted">Challenge</dt>
                <dd className="mt-2 text-pretty leading-relaxed text-white/90">
                  {project.challenge}
                </dd>
              </div>
              <div>
                <dt className="text-eyebrow uppercase text-muted">Approach</dt>
                <dd className="mt-2 text-pretty leading-relaxed text-white/90">
                  {project.approach}
                </dd>
              </div>
              <div>
                <dt className="text-eyebrow uppercase text-muted">Tools</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <Badge key={tool} variant="glow">
                      {tool}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-eyebrow uppercase text-muted">Outcome</dt>
                <dd className="mt-2 text-pretty leading-relaxed text-white/90">
                  {project.outcome}
                </dd>
              </div>
            </dl>

            <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <li key={metric.label} className="bg-surface/80 p-5">
                  <p className="text-2xl font-extrabold tracking-tight text-white">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                    {metric.label}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsSection() {
  const meta = SECTION_BY_ID.projects;

  return (
    <>
      <SectionShell
        id="projects"
        index={meta.index}
        eyebrow={meta.eyebrow}
        width="full"
        title={
          <>
            Four problems, and what
            <br />
            actually changed.
          </>
        }
        lede="Each of these started as a question nobody could answer with the data on hand. Open one for the challenge, the approach and what came out the other side."
      >
        {/* Two columns on the left half of the viewport, so the monolith
            gallery behind stays visible and clickable rather than being
            papered over by the DOM. */}
        <ul className="mt-4 grid max-w-3xl gap-5 sm:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <li key={project.id}>
              <ProjectCard project={project} index={index} />
            </li>
          ))}
        </ul>
      </SectionShell>

      <CaseStudy />
    </>
  );
}
