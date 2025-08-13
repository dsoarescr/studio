'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const defaultSEO = {
  title: 'Pixel Universe - Mapa Interativo de Portugal',
  description: 'Explore, compre e personalize píxeis no mapa interativo de Portugal. Crie identidades digitais únicas, participe da comunidade e desbloqueie conquistas épicas.',
  keywords: ['pixel art', 'Portugal', 'mapa interativo', 'arte digital', 'NFT', 'comunidade', 'gamificação', 'identidade digital'],
  image: '/Fundo.jpg',
  type: 'website' as const,
  author: 'Pixel Universe Team',
};

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SEOHeadProps) {
  const pathname = usePathname();
  
  const seoTitle = title ? `${title} | Pixel Universe` : defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoKeywords = [...defaultSEO.keywords, ...keywords].join(', ');
  const seoImage = image || defaultSEO.image;
  const seoUrl = url || `https://pixeluniverse.pt${pathname}`;
  const seoAuthor = author || defaultSEO.author;

  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    name: seoTitle,
    description: seoDescription,
    url: seoUrl,
    image: seoImage,
    author: {
      '@type': 'Organization',
      name: seoAuthor,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pixel Universe',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pixeluniverse.pt/logo.png',
      },
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    ...(section && { articleSection: section }),
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={seoAuthor} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="Pixel Universe" />
      <meta property="og:locale" content="pt_PT" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:creator" content="@pixeluniverse" />
      <meta name="twitter:site" content="@pixeluniverse" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#D4A757" />
      <meta name="msapplication-TileColor" content="#D4A757" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Geo Tags for Portugal */}
      <meta name="geo.region" content="PT" />
      <meta name="geo.country" content="Portugal" />
      <meta name="geo.placename" content="Portugal" />
      
      {/* App-specific Meta Tags */}
      <meta name="application-name" content="Pixel Universe" />
      <meta name="apple-mobile-web-app-title" content="Pixel Universe" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.pixeluniverse.pt" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </Head>
  );
}

// Hook for dynamic SEO
export function useSEO() {
  const pathname = usePathname();
  
  const updateSEO = (seoData: Partial<SEOHeadProps>) => {
    // Update document title
    if (seoData.title) {
      document.title = `${seoData.title} | Pixel Universe`;
    }
    
    // Update meta description
    if (seoData.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seoData.description);
      }
    }
    
    // Update Open Graph tags
    if (seoData.image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', seoData.image);
      }
    }
  };

  const generatePixelSEO = (x: number, y: number, region: string) => {
    return {
      title: `Pixel (${x}, ${y}) em ${region}`,
      description: `Explore este pixel único localizado em ${region}, Portugal. Compre, personalize e crie sua identidade digital no Pixel Universe.`,
      keywords: ['pixel', region.toLowerCase(), 'portugal', 'arte digital'],
      type: 'article' as const,
    };
  };

  const generateUserSEO = (username: string, level: number) => {
    return {
      title: `Perfil de ${username}`,
      description: `Conheça ${username}, nível ${level} no Pixel Universe. Veja seus pixels, conquistas e criações únicas.`,
      type: 'profile' as const,
    };
  };

  return {
    updateSEO,
    generatePixelSEO,
    generateUserSEO,
  };
}

// Component for tracking page views
export function PageViewTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { level, pixels, achievements } = useUserStore();

  useEffect(() => {
    const analytics = AnalyticsManager.getInstance();
    
    analytics.track('page_view', {
      path: pathname,
      userLevel: level,
      userPixels: pixels,
      userAchievements: achievements,
    }, user?.uid);
  }, [pathname, user?.uid, level, pixels, achievements]);

  return null;
}

export { SEOHead };