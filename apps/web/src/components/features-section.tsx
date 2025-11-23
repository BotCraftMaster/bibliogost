import { CheckCircle, Lock, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Мгновенное форматирование",
      description:
        "Обработка списка литературы занимает всего несколько секунд. Не нужно вручную расставлять знаки препинания и форматировать каждую ссылку.",
    },
    {
      icon: CheckCircle,
      title: "Соответствие ГОСТ",
      description:
        "Полное соответствие стандартам ГОСТ Р 7.0.100-2018 и ГОСТ 7.0.5-2008. Подходит для дипломных, курсовых работ и диссертаций.",
    },
    {
      icon: Lock,
      title: "Конфиденциальность",
      description:
        "Все данные обрабатываются локально в вашем браузере. Мы не сохраняем и не передаем третьим лицам ваши тексты.",
    },
  ];

  return (
    <section className="bg-muted/50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            Почему выбирают наш сервис
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Простой и надежный инструмент для оформления библиографии
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-lg p-3">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
