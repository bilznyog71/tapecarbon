import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://alfacarbon.shop'),
  title: 'Tapetes Bandeja 3D sob Medida | AlfaCarbon',
  description:
    'Tapetes bandeja 3D em TPE injetado de alta densidade, fabricados sob medida exata da sua marca, modelo e ano. Borda elevada, 100% impermeável. Frete grátis para todo o Brasil e 12 meses de garantia.',
  icons: {
    icon: '/assets/img/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'AlfaCarbon Brasil',
    title: 'Tapetes Bandeja 3D sob Medida | AlfaCarbon',
    description:
      'Molde 3D do assoalho do seu carro. Borda elevada, TPE impermeável, frete grátis para todo o Brasil.',
    images: [
      {
        url: '/assets/img/interior-instalado.webp',
        width: 1200,
        height: 800,
        alt: 'AlfaCarbon — Tapetes 3D sob Medida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tapetes Bandeja 3D sob Medida | AlfaCarbon',
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
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '911004608413241');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=911004608413241&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
