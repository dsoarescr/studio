'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { posthog } from '@/lib/posthog';

export default function PosthogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!posthog) return;
    try {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: pathname,
      });
    } catch {}
  }, [pathname, searchParams]);

  return null;
}
