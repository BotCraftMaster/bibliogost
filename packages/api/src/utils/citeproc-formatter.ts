/**
 * Форматирование библиографических ссылок с помощью citeproc-js
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { stripHtml } from "string-strip-html";

import type { CiteprocReference } from "./grobid-client";

// Типы для citeproc (упрощенные)
interface CSLEngine {
  updateItems: (ids: string[]) => void;
  makeBibliography: () => [unknown, string[]];
}

export type CslStyle = "gost-2008" | "gost-2018";

/**
 * Форматирует ссылки в соответствии с выбранным стилем ГОСТ
 */
export function formatReferences(
  references: CiteprocReference[],
  style: CslStyle = "gost-2018",
): string[] {
  try {
    // Загружаем CSL стиль
    const cslStyle = loadCslStyle(style);

    // Создаем движок citeproc
    const engine = createCiteprocEngine(cslStyle, references);

    // Генерируем библиографию
    const ids = references.map((ref) => ref.id);
    engine.updateItems(ids);
    const [, bibliography] = engine.makeBibliography();

    // Очищаем от HTML тегов
    return bibliography.map((entry) => cleanHtmlTags(entry));
  } catch (error) {
    console.error("Citeproc formatting error:", error);
    // Возвращаем простое форматирование при ошибке
    return references.map((ref) => formatSimple(ref));
  }
}

/**
 * Удаляет HTML теги из строки
 */
function cleanHtmlTags(html: string): string {
  const cleaned = stripHtml(html).result;
  return cleaned
    .replace(/\s+/g, " ") // Заменяем множественные пробелы на одинарные
    .replace(/^\d+\.\s*/, "") // Удаляем нумерацию в начале
    .trim();
}

/**
 * Загружает CSL стиль из файла
 */
function loadCslStyle(style: CslStyle): string {
  const fileName =
    style === "gost-2008" ? "gost-r-7-0-5-2008.csl" : "gost-r-7-0-100-2018.csl";

  // Пробуем несколько возможных путей
  const possiblePaths = [
    // Относительно корня проекта (monorepo)
    resolve(
      process.cwd(),
      "../../",
      "packages",
      "api",
      "src",
      "styles",
      fileName,
    ),
    // Относительно src (если запущено из packages/api)
    resolve(process.cwd(), "src", "styles", fileName),
    // Относительно текущей директории
    resolve(process.cwd(), "styles", fileName),
  ];

  for (const filePath of possiblePaths) {
    try {
      const content = readFileSync(filePath, "utf-8");
      console.log(`✓ Successfully loaded CSL style from: ${filePath}`);
      return content;
    } catch {
      // Пробуем следующий путь
      continue;
    }
  }

  // Если не нашли файл, выбрасываем ошибку с подробной информацией
  const errorMsg = `CSL style file not found: ${fileName}
Current working directory: ${process.cwd()}
Tried paths:
${possiblePaths.map((p) => `  - ${p}`).join("\n")}`;

  throw new Error(errorMsg);
}

/**
 * Создает движок citeproc
 */
function createCiteprocEngine(
  cslStyle: string,
  references: CiteprocReference[],
): CSLEngine {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const CSL = require("citeproc");

  const sys = {
    retrieveLocale: (_lang: string) => {
      // Возвращаем минимальную локаль для ru-RU
      return `<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="ru-RU">
  <terms>
    <term name="accessed">дата обращения</term>
    <term name="and">и</term>
    <term name="et-al">и др.</term>
    <term name="page" form="short">С.</term>
    <term name="volume" form="short">Т.</term>
    <term name="issue" form="short">№</term>
  </terms>
</locale>`;
    },
    retrieveItem: (id: string) => references.find((ref) => ref.id === id),
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return new CSL.Engine(sys, cslStyle);
}

/**
 * Простое форматирование без citeproc (fallback) по ГОСТ
 */
function formatSimple(ref: CiteprocReference): string {
  const parts: string[] = [];

  // Авторы (Фамилия И.О.)
  if (ref.author && ref.author.length > 0) {
    const authors = ref.author
      .map((a) => {
        const initials = a.given
          ? a.given
              .split(/\s+/)
              .map((n) => n.charAt(0).toUpperCase() + ".")
              .join(" ")
          : "";
        return `${a.family} ${initials}`.trim();
      })
      .join(", ");
    parts.push(authors);
  }

  // Название
  if (ref.title) {
    parts.push(ref.title);
  }

  // Для статей в журналах
  if (ref.type === "article-journal" && ref["container-title"]) {
    let journalPart = `// ${ref["container-title"]}`;

    // Год
    if (ref.issued?.["date-parts"]?.[0]?.[0]) {
      journalPart += `. ${ref.issued["date-parts"][0][0]}`;
    }

    // Том
    if (ref.volume) {
      journalPart += `. Т. ${ref.volume}`;
    }

    // Номер
    if (ref.issue) {
      journalPart += `. № ${ref.issue}`;
    }

    parts.push(journalPart);

    // Страницы
    if (ref.page) {
      parts.push(`С. ${ref.page}`);
    }
  }
  // Для книг
  else if (ref.type === "book") {
    // Место издания и издательство
    const publisherParts: string[] = [];
    if (ref["publisher-place"]) {
      publisherParts.push(ref["publisher-place"]);
    }
    if (ref.publisher) {
      publisherParts.push(ref.publisher);
    }
    if (publisherParts.length > 0) {
      parts.push(publisherParts.join(": "));
    }

    // Год
    if (ref.issued?.["date-parts"]?.[0]?.[0]) {
      parts.push(ref.issued["date-parts"][0][0].toString());
    }
  }
  // Для веб-страниц
  else if (ref.type === "webpage") {
    // Для веб-страниц не добавляем год отдельно, он будет в дате обращения
  }

  // DOI
  if (ref.DOI) {
    parts.push(`DOI: ${ref.DOI}`);
  }

  // URL с датой обращения
  if (ref.URL) {
    let urlPart = `URL: ${ref.URL}`;
    if (ref.accessed?.["date-parts"]?.[0]) {
      const [year, month, day] = ref.accessed["date-parts"][0];
      if (year && month && day) {
        urlPart += ` (дата обращения: ${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year})`;
      }
    }
    parts.push(urlPart);
  }

  return parts.join(". ") + ".";
}

/**
 * Проверяет наличие недостающих данных
 */
export function checkMissingFields(ref: CiteprocReference): string[] {
  const missing: string[] = [];

  if (!ref.author || ref.author.length === 0) {
    missing.push("автор");
  }
  if (!ref.title) {
    missing.push("название");
  }
  if (!ref.issued) {
    missing.push("год");
  }
  if (ref.type === "article-journal" && !ref["container-title"]) {
    missing.push("журнал");
  }
  if (ref.type === "article-journal" && !ref.page) {
    missing.push("страницы");
  }

  return missing;
}
