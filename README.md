# BiblioGOST

Веб-сервис для автоматического форматирования библиографических ссылок по стандартам ГОСТ.

## О проекте

BiblioGOST — это open-source инструмент, который помогает исследователям, студентам и авторам автоматически форматировать библиографические ссылки в соответствии с российскими стандартами ГОСТ Р 7.0.5-2008 и ГОСТ Р 7.0.100-2018.

### Как это работает

1. Вы вставляете "грязный" текст с библиографическими ссылками
2. Система автоматически очищает текст от лишних символов и нумерации
3. Каждая ссылка обрабатывается через [GROBID](https://github.com/kermitt2/grobid) — систему машинного обучения для извлечения библиографических данных
4. Извлеченные данные форматируются с помощью [citeproc-js](https://github.com/Juris-M/citeproc-js) в соответствии с выбранным стандартом ГОСТ
5. Вы получаете корректно отформатированные ссылки

### Возможности

- ✅ Поддержка ГОСТ Р 7.0.5-2008 и ГОСТ Р 7.0.100-2018
- ✅ Автоматическое извлечение метаданных из неструктурированного текста
- ✅ Обработка различных типов публикаций (статьи, книги, веб-страницы)
- ✅ Автоматическое добавление даты обращения для URL
- ✅ Предупреждения о недостающих полях
- ✅ Пакетная обработка множества ссылок

## Установка

Требования:

- [Bun](https://bun.sh) v1.3.3 или выше

```bash
# Клонировать репозиторий
git clone https://github.com/BotCraftMaster/bibliogost
cd bibliogost

# Установить зависимости
bun install

# Настроить переменные окружения (опционально)
cp .env.example .env

# Запустить dev-сервер
bun dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Переменные окружения

- `GROBID_URL` — URL сервера GROBID (по умолчанию: `https://kermitt2-grobid.hf.space`)
  - Demo-сервер с DL моделями: `https://kermitt2-grobid.hf.space` (точнее, медленнее)
  - Demo-сервер с CRF: `https://kermitt2-grobid-crf.hf.space` (быстрее, менее точный)
  - Для production рекомендуется развернуть собственный GROBID сервер

## Деплой

### Vercel

1. Создайте новый проект на [Vercel](https://vercel.com)
2. Выберите папку `apps/web` как корневую директорию
3. (Опционально) Добавьте переменную окружения `GROBID_URL`
4. Готово!

## Технологии

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [Next.js 16](https://nextjs.org) + [React 19](https://react.dev)
- **API**: [tRPC v11](https://trpc.io)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI**: [shadcn/ui](https://ui.shadcn.com)
- **Monorepo**: [Turborepo](https://turborepo.org)
- **Парсинг библиографии**: [GROBID](https://github.com/kermitt2/grobid)
- **Форматирование**: [citeproc-js](https://github.com/Juris-M/citeproc-js)

## Структура проекта

```text
apps/
  └─ web/              # Next.js веб-приложение
packages/
  ├─ api/              # tRPC API с логикой обработки цитирований
  ├─ ui/               # UI компоненты (shadcn/ui)
  └─ validators/       # Zod схемы валидации
tooling/
  ├─ eslint/           # Конфигурация ESLint
  ├─ prettier/         # Конфигурация Prettier
  ├─ tailwind/         # Конфигурация Tailwind
  └─ typescript/       # Общие tsconfig
```

## Разработка

```bash
# Запустить dev-сервер
bun dev

# Сборка
bun build

# Линтинг
bun lint

# Форматирование
bun format

# Проверка типов
bun typecheck
```

## Вклад в проект

Мы приветствуем любой вклад! Не стесняйтесь открывать Issues и Pull Requests.

## Лицензия

MIT

## Благодарности

Проект использует:

- [GROBID](https://github.com/kermitt2/grobid) для извлечения библиографических данных
- [citeproc-js](https://github.com/Juris-M/citeproc-js) для форматирования цитирований
- CSL стили ГОСТ из [citation-style-language/styles](https://github.com/citation-style-language/styles)
