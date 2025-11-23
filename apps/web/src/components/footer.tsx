export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-background border-t px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              ГОСТ Форматер
            </h3>
            <p className="text-muted-foreground text-sm">
              Бесплатный онлайн-сервис для оформления списка литературы
            </p>
          </div>

          <div className="border-border border-t pt-6">
            <div className="text-muted-foreground space-y-2 text-center text-xs leading-relaxed">
              <p>
                Обработка выполняется через GROBID API. Данные не сохраняются
                после обработки.
              </p>
              <p>
                Поддерживаемые стандарты: ГОСТ Р 7.0.100-2018, ГОСТ 7.0.5-2008
              </p>
              <p className="text-muted-foreground/70">
                © {currentYear} BiblioGOST. Все права защищены.
              </p>
              <p className="text-muted-foreground/70">
                Связь с автором:{" "}
                <a
                  href="https://t.me/BotCraftEngineer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground underline transition-colors"
                >
                  @BotCraftEngineer
                </a>
              </p>
            </div>
          </div>

          <div className="text-muted-foreground/60 flex flex-wrap items-center justify-center gap-4 text-xs">
            <span>Оформление библиографии</span>
            <span>•</span>
            <span>Список литературы ГОСТ</span>
            <span>•</span>
            <span>Форматирование ссылок</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
