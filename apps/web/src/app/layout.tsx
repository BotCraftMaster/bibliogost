import type { Metadata } from "next";
import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./styles.css";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@bibliogost/ui";

export const metadata: Metadata = {
  title:
    "ГОСТ Форматер | Оформление списка литературы по ГОСТ 7.0.5-2008 и ГОСТ Р 7.0.100-2018",
  description:
    "Бесплатный онлайн-сервис для автоматического оформления библиографического списка по ГОСТ 7.0.5-2008 и ГОСТ Р 7.0.100-2018. Форматирование списка литературы для диплома, курсовой, диссертации за секунды. Работает в браузере без регистрации.",
  keywords: [
    "оформление списка литературы",
    "ГОСТ 2018",
    "ГОСТ 2008",
    "библиографический список",
    "форматирование библиографии",
    "список литературы по ГОСТ",
    "оформление источников",
    "библиография ГОСТ",
    "курсовая работа",
    "дипломная работа",
    "диссертация",
    "научная работа",
    "ГОСТ Р 7.0.100-2018",
    "ГОСТ 7.0.5-2008",
    "автоматическое оформление",
    "онлайн форматер",
  ],
  authors: [{ name: "BiblioGOST" }],
  creator: "BiblioGOST",
  publisher: "BiblioGOST",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://bibliogost.vercel.app",
    siteName: "ГОСТ Форматер",
    title: "ГОСТ Форматер | Оформление списка литературы по ГОСТ",
    description:
      "Бесплатный онлайн-сервис для автоматического оформления библиографического списка по ГОСТ 7.0.5-2008 и ГОСТ Р 7.0.100-2018. Форматирование за секунды без регистрации.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ГОСТ Форматер - Оформление списка литературы",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ГОСТ Форматер | Оформление списка литературы по ГОСТ",
    description:
      "Бесплатный онлайн-сервис для автоматического оформления библиографического списка по ГОСТ 2018 и 2008",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://bibliogost.vercel.app",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    // Добавьте коды верификации после регистрации в поисковых системах
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased`}>
        <TRPCReactProvider>
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
