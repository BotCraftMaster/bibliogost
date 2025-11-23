"use client";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ГОСТ Форматер",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
    },
    description:
      "Бесплатный онлайн-сервис для автоматического оформления библиографического списка по ГОСТ 7.0.5-2008 и ГОСТ Р 7.0.100-2018",
    url: "https://bibliogost.vercel.app",
    featureList: [
      "Оформление по ГОСТ Р 7.0.100-2018",
      "Оформление по ГОСТ 7.0.5-2008",
      "Автоматическое форматирование",
      "Работа без регистрации",
      "Обработка в браузере",
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
