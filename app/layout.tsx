import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/hooks/useStore';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tapecarbon.com.br'),
  title: 'Tapetes Bandeja 3D sob Medida | TapeCarbon Brasil',
  description:
    'Tapetes bandeja 3D em TPE injetado de alta densidade, fabricados sob medida exata da sua marca, modelo e ano. Borda elevada, 100% impermeável. Frete grátis para todo o Brasil e 12 meses de garantia.',
  icons: {
    icon: '/assets/img/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'TapeCarbon Brasil',
    title: 'Tapetes Bandeja 3D sob Medida | TapeCarbon Brasil',
    description:
      'Molde 3D do assoalho do seu carro. Borda elevada, TPE impermeável, frete grátis para todo o Brasil.',
    images: [
      {
        url: '/assets/img/interior-instalado.webp',
        width: 1200,
        height: 800,
        alt: 'TapeCarbon — Tapetes 3D sob Medida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tapetes Bandeja 3D sob Medida | TapeCarbon Brasil',
    description:
      'Tapetes bandeja 3D sob medida exata para o seu veículo. 100% impermeável, frete grátis para todo o Brasil.',
    images: ['/assets/img/interior-instalado.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
        <link rel="preload" as="image" href="/assets/img/ambiente-onix.webp" />
      </head>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
