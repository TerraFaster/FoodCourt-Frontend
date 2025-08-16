import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
import { AppProviders } from './components/providers/AppProviders';
import { getServerLocale } from '@/lib/locale/server';
import "./globals.css";

const IgraSans = localFont({
  src: [
    {
      path: '../fonts/IgraSans.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-igrasans',
  display: 'swap',
});

// Dynamic metadata based on locale
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  
  const metadata = {
    en: {
      title: "BeerHop - Food Court Menu | Delicious Food and Craft Beer",
      description: "Discover the diverse menu of BeerHop food court! Delicious dishes from world cuisine, craft beer and cozy atmosphere in one place.",
      keywords: ['beerhop', 'food court', 'menu', 'food', 'restaurant', 'craft beer', 'cafe', 'cuisine', 'dishes', 'delicious', 'kyiv'],
      openGraph: {
        title: 'BeerHop - Food Court Menu | Delicious Food and Craft Beer',
        description: 'Discover the diverse menu of BeerHop food court! Delicious dishes from world cuisine, craft beer and cozy atmosphere in one place.',
        locale: 'en_US',
      },
      twitter: {
        title: 'BeerHop - Food Court Menu | Delicious Food and Craft Beer',
        description: 'Discover the diverse menu of BeerHop food court! Delicious dishes from world cuisine, craft beer and cozy atmosphere.',
      }
    },
    uk: {
      title: "BeerHop - Меню фуд-корту | Смачна їжа та крафтове пиво",
      description: "Відкрийте для себе різноманітне меню фуд-корту BeerHop! Смачні страви світової кухні, крафтове пиво та затишна атмосфера в одному місці.",
      keywords: ['beerhop', 'фуд-корт', 'меню', 'їжа', 'ресторан', 'крафтове пиво', 'кафе', 'кухня', 'страви', 'смачно', 'київ', 'food court'],
      openGraph: {
        title: 'BeerHop - Меню фуд-корту | Смачна їжа та крафтове пиво',
        description: 'Відкрийте для себе різноманітне меню фуд-корту BeerHop! Смачні страви світової кухні, крафтове пиво та затишна атмосфера в одному місці.',
        locale: 'uk_UA',
      },
      twitter: {
        title: 'BeerHop - Меню фуд-корту | Смачна їжа та крафтове пиво',
        description: 'Відкрийте для себе різноманітне меню фуд-корту BeerHop! Смачні страви світової кухні, крафтове пиво та затишна атмосфера.',
      }
    }
  };

  const localizedContent = metadata[locale];

  return {
    title: localizedContent.title,
    description: localizedContent.description,
    keywords: localizedContent.keywords,
    authors: [{ name: 'BeerHop' }],
    creator: 'BeerHop',
    openGraph: {
      type: 'website',
      locale: localizedContent.openGraph.locale,
      url: 'https://beerhop.ua',
      title: localizedContent.openGraph.title,
      description: localizedContent.openGraph.description,
      siteName: 'BeerHop Food Court',
      images: [{
        url: 'https://beerhop.ua/og-image.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'uk' 
          ? 'BeerHop фуд-корт - смачна їжа та крафтове пиво'
          : 'BeerHop food court - delicious food and craft beer',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedContent.twitter.title,
      description: localizedContent.twitter.description,
      creator: '@beerhop_ua',
      images: ['https://beerhop.ua/twitter-image.jpg'],
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
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getServerLocale();

  return (
    <html lang={locale} className={IgraSans.variable}>
      <body className="text-white font-sans">
        <AppProviders messages={messages} locale={locale}>
          <div className="min-h-screen">
            <main>{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}