import posthog from 'posthog-js';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: posthog => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
    capture_pageview: false, // Handled by Next.js
  });
}

export { posthog };
