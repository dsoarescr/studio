// src/app/page.tsx
'use client';

// This file is intentionally left minimal. 
// The main content is now in app/(main)/page.tsx to ensure it uses the correct layout.
import HomePage from './(main)/page';

export default function Page() {
  return <HomePage />;
}
