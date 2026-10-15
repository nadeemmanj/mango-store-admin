import type { Metadata } from 'next';
import Providers from './providers';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.maanalkhair.ae'),

  title: {
    default: 'Maan Al Khair — Fresh Fruits & Vegetables in Dubai',
    template: '%s | Maan Al Khair Dubai',
  },
  description:
    'Dubai\'s trusted online store for premium fresh fruits and vegetables. Same-day delivery across Dubai, Sharjah, and Abu Dhabi. Farm-fresh, organic, and seasonal produce delivered to your door.',

  keywords: [
    'fresh fruits Dubai', 'vegetables delivery Dubai', 'online grocery Dubai',
    'organic fruits UAE', 'same day delivery Dubai', 'mango delivery Dubai',
    'fresh produce UAE', 'fruits and vegetables online UAE',
    'grocery delivery Sharjah', 'organic vegetables Abu Dhabi',
    'Maan Al Khair', 'مانع الخير', 'فواكه وخضروات دبي',
  ],

  authors: [{ name: 'Maan Al Khair', url: 'https://www.maanalkhair.ae' }],
  creator: 'Maan Al Khair',
  publisher: 'Maan Al Khair LLC',

  openGraph: {
    type: 'website',
    locale: 'en_AE',
    alternateLocale: ['ar_AE'],
    url: 'https://www.maanalkhair.ae',
    siteName: 'Maan Al Khair',
    title: 'Maan Al Khair — Fresh Fruits & Vegetables in Dubai',
    description:
      'Premium fresh fruits and vegetables delivered same-day across Dubai and UAE. Farm-fresh quality guaranteed.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Maan Al Khair — Fresh Fruits & Vegetables Dubai',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Maan Al Khair — Fresh Fruits & Vegetables in Dubai',
    description: 'Premium fresh fruits and vegetables. Same-day delivery across Dubai & UAE.',
    images: ['/og-image.jpg'],
    creator: '@maanalkhair',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  alternates: {
    canonical: 'https://www.maanalkhair.ae',
    languages: {
      'en-AE': 'https://www.maanalkhair.ae',
      'ar-AE': 'https://www.maanalkhair.ae/ar',
    },
  },

  verification: {
    google: 'your-google-verification-code',
  },

  category: 'food & grocery',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        {/* Dubai/UAE structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GroceryStore',
              name: 'Maan Al Khair',
              description: 'Fresh fruits and vegetables delivery in Dubai, UAE',
              url: 'https://www.maanalkhair.ae',
              telephone: '+971-4-000-0000',
              email: 'orders@maanalkhair.ae',
              currenciesAccepted: 'AED',
              paymentAccepted: 'Cash, Credit Card, Debit Card',
              priceRange: 'AED 5 - AED 200',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Al Wasl Road, Jumeirah',
                addressLocality: 'Dubai',
                addressRegion: 'Dubai',
                addressCountry: 'AE',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 25.2048,
                longitude: 55.2708,
              },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday'], opens: '08:00', closes: '22:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '08:00', closes: '12:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '14:00', closes: '22:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday','Sunday'], opens: '09:00', closes: '22:00' },
              ],
              sameAs: [
                'https://www.instagram.com/maanalkhair',
                'https://www.facebook.com/maanalkhair',
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Fresh Fruits & Vegetables',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Fresh Mangoes', category: 'Fruits' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Organic Vegetables', category: 'Vegetables' } },
                ],
              },
            }),
          }}
        />
        {/* UAE region hint */}
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
        {/* Apple / PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Maan Al Khair" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1c6b3a" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}