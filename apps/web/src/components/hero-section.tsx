export default function HeroSection() {
  return (
    <section className="bg-background relative overflow-hidden px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-6 text-center">
          <div className="bg-secondary inline-block rounded-full px-4 py-1">
            <p className="text-secondary-foreground text-xs font-medium tracking-wide uppercase">
              Бесплатный онлайн-сервис
            </p>
          </div>
          <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Оформление списка литературы по ГОСТ онлайн
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed text-balance sm:text-lg">
            Автоматическое форматирование библиографического списка по ГОСТ Р
            7.0.100-2018 и ГОСТ 7.0.5-2008. Идеально для курсовых, дипломных
            работ и диссертаций. Просто вставьте текст и получите готовый
            результат за секунды.
          </p>
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">✓ Без регистрации</span>
            <span className="flex items-center gap-1">✓ Бесплатно</span>
            <span className="flex items-center gap-1">✓ Конфиденциально</span>
          </div>
        </div>
      </div>
    </section>
  );
}
