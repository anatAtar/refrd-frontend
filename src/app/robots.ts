import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/feed',
        '/jobs',
        '/applications',
        '/network',
        '/notifications',
        '/settings',
        '/onboarding',
        '/join',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/auth',
      ],
    },
    sitemap: 'https://direct-ref.com/sitemap.xml',
  };
}
