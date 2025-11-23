export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Скопируйте список литературы",
      description:
        "Вставьте неотформатированный список из Word, PDF или любого другого источника в текстовое поле.",
    },
    {
      number: "2",
      title: "Выберите стандарт ГОСТ",
      description:
        "Укажите нужную версию стандарта: ГОСТ Р 7.0.100-2018 (новый) или ГОСТ 7.0.5-2008 (старый).",
    },
    {
      number: "3",
      title: "Получите готовый результат",
      description:
        "Нажмите кнопку «Преобразовать» и скопируйте отформатированный список в свою работу.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            Как это работает
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Три простых шага до идеально оформленного списка литературы
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 rounded-lg border p-6 transition-shadow hover:shadow-md"
            >
              <div className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                {step.number}
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
