import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content/profile';
import { SECTIONS } from '@/lib/content/sections';

/**
 * The site is a single document, so the sitemap lists the page itself plus each
 * section anchor — that is what lets search engines deep-link to, say, the
 * projects environment.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...SECTIONS.filter((section) => section.id !== 'landing').map((section) => ({
      url: `${SITE.url}/#${section.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
