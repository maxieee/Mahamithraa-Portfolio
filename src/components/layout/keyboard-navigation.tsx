'use client';

import { useEffect } from 'react';
import { SECTIONS } from '@/lib/content/sections';
import { getUi, setUi } from '@/lib/store';
import { releaseCamera } from '@/components/canvas/camera-focus';
import { useScrollApi } from '@/components/providers/smooth-scroll-provider';
import { clamp } from '@/lib/utils';

const EDITABLE = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Section-level keyboard navigation.
 *
 * Page Up/Down and Home/End move between environments; Escape backs out of any
 * open detail view and releases the camera. Ordinary arrow-key and tab
 * scrolling is left to the browser so nothing standard is hijacked.
 */
export function KeyboardNavigation() {
  const scroll = useScrollApi();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (EDITABLE.has(target.tagName) || target.isContentEditable)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const { activeIndex, openProject, openCertificate, activeSkill } = getUi();

      const jump = (index: number) => {
        event.preventDefault();
        const next = SECTIONS[clamp(index, 0, SECTIONS.length - 1)];
        if (next) scroll.scrollToSection(next.id);
      };

      switch (event.key) {
        case 'PageDown':
          jump(activeIndex + 1);
          break;
        case 'PageUp':
          jump(activeIndex - 1);
          break;
        case 'Home':
          jump(0);
          break;
        case 'End':
          jump(SECTIONS.length - 1);
          break;
        case 'Escape':
          if (openProject) {
            setUi({ openProject: null });
            releaseCamera();
          } else if (openCertificate) {
            setUi({ openCertificate: null });
          } else if (activeSkill) {
            setUi({ activeSkill: null });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scroll]);

  return null;
}
