import { DefaultSeoProps } from 'next-seo';

export const defaultSEO: DefaultSeoProps = {
  titleTemplate: '%s | Pixel Universe',
  defaultTitle: 'Pixel Universe',
  description: 'Mapa interativo de pixels em Portugal',
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    site_name: 'Pixel Universe',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};
