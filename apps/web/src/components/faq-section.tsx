"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Какой ГОСТ выбрать для оформления списка литературы?",
      answer:
        "Для работ, сдаваемых после 2019 года, рекомендуется использовать ГОСТ Р 7.0.100-2018. Однако некоторые учебные заведения до сих пор требуют ГОСТ 7.0.5-2008. Уточните требования в вашем вузе или у научного руководителя.",
    },
    {
      question: "Сохраняются ли мои данные на сервере?",
      answer:
        "Нет, мы не сохраняем ваши данные. Вся обработка происходит через защищенное API-соединение, и текст удаляется сразу после форматирования. Ваша конфиденциальность полностью защищена.",
    },
    {
      question: "Можно ли использовать сервис бесплатно?",
      answer:
        "Да, сервис полностью бесплатный и не требует регистрации. Вы можете форматировать неограниченное количество списков литературы без каких-либо ограничений.",
    },
    {
      question: "Как скачать отформатированный список?",
      answer:
        "После форматирования вы можете скопировать результат в буфер обмена кнопкой 'Копировать' и вставить в ваш документ. В будущем планируется добавить экспорт в форматы DOCX и PDF.",
    },
    {
      question: "Какие типы источников поддерживаются?",
      answer:
        "Сервис поддерживает форматирование книг, статей из журналов, электронных ресурсов, диссертаций и других типов источников согласно требованиям ГОСТ.",
    },
    {
      question: "Что делать, если результат содержит ошибки?",
      answer:
        "Автоматическое форматирование может не всегда корректно распознать все элементы источника. Рекомендуется проверить результат и при необходимости внести ручные правки. Убедитесь, что исходный текст содержит все необходимые данные.",
    },
  ];

  // JSON-LD для FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
              Часто задаваемые вопросы
            </h2>
            <p className="text-muted-foreground text-lg">
              Ответы на популярные вопросы об оформлении списка литературы
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-border overflow-hidden rounded-lg border"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="text-foreground hover:bg-muted/50 flex w-full items-center justify-between p-6 text-left transition-colors"
                >
                  <span className="pr-4 font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`text-muted-foreground h-5 w-5 shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="text-muted-foreground border-t px-6 pt-4 pb-6">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
