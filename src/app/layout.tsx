import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { PROFILE, SITE, SOCIALS } from '@/lib/content/profile';
import { CERTIFICATIONS } from '@/lib/content/career';
import { SKILLS } from '@/lib/content/skills';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${PROFILE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: PROFILE.name, url: SITE.url }],
  creator: PROFILE.name,
  applicationName: `${PROFILE.name} Portfolio`,
  category: 'portfolio',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: `${PROFILE.name} — Portfolio`,
    title: SITE.title,
    description: SITE.description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    creator: '@mahamithraa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#050816',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/** schema.org Person graph — how search engines read the whole CV. */
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PROFILE.name,
  url: SITE.url,
  jobTitle: PROFILE.role,
  description: PROFILE.summary,
  email: `mailto:${PROFILE.email}`,
  address: { '@type': 'PostalAddress', addressLocality: PROFILE.location },
  sameAs: SOCIALS.map((social) => social.href),
  knowsAbout: SKILLS.map((skill) => skill.name),
  hasCredential: CERTIFICATIONS.map((certification) => ({
    '@type': 'EducationalOccupationalCredential',
    name: certification.name,
    credentialCategory: certification.focus,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* The variable font is on the critical path for first paint. */}
        <link
          rel="preload"
          href="/fonts/InterVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="grain min-h-screen bg-void text-white">
        <a href="#landing" className="sr-focusable">
          Skip to content
        </a>
        {children}
        <Script
          id="person-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          // Serialised from typed content above — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
