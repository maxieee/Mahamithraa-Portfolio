import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content/profile';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The contact endpoint has nothing to index and should not be crawled.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
