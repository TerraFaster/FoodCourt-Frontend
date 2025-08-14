import type { Metadata } from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "./globals.css";

export const metadata: Metadata = {
  title: "BeerHop - Меню фуд-корту | Смачна їжа та крафтове пиво",
  description: "Відкрийте для себе різноманітне меню фуд-корту BeerHop! Смачні страви світової кухні, крафтове пиво та затишна атмосфера в одному місці.",
  keywords: ['beerhop', 'фуд-корт', 'меню', 'їжа', 'ресторан', 'крафтове пиво', 'кафе', 'кухня', 'страви', 'смачно', 'київ', 'food court'],
  authors: [{ name: 'BeerHop' }],
  creator: 'BeerHop',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://beerhop.ua',
    title: 'BeerHop - Меню фуд-корту | Смачна їжа та крафтове пиво',
    description: 'Відкрийте для себе різноманітне меню фуд-корту BeerHop! Смачні страви світової кухні, крафтове пиво та затишна атмосфера в одному місці.',
    siteName: 'BeerHop Food Court',
    images: [{
      url: 'https://beerhop.ua/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'BeerHop фуд-корт - смачна їжа та крафтове пиво',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeerHop - Меню фуд-корту | Смачна їжа та крафтове пиво',
    description: 'Відкрийте для себе різноманітне меню фуд-корту BeerHop! Смачні страви світової кухні, крафтове пиво та затишна атмосфера.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="uk">
      <body className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen">
            <main>{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}