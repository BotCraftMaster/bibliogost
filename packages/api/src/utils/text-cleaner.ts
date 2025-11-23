/**
 * Утилиты для очистки "грязного" ввода библиографических ссылок
 */

/**
 * Очищает текст от нумерации и специальных символов
 */
export function cleanText(text: string): string {
  let cleaned = text;

  // Удалить нумерацию: 1., 2., [1], *
  cleaned = cleaned.replace(/^\s*\d+\.\s*/gm, "");
  cleaned = cleaned.replace(/^\s*\[\d+\]\s*/gm, "");
  cleaned = cleaned.replace(/^\s*\*\s*/gm, "");

  // Удалить символы: ▶, •, →, »
  cleaned = cleaned.replace(/[▶•→»]/g, "");

  // Заменить длинные пробелы на одинарные
  cleaned = cleaned.replace(/\s+/g, " ");

  // Удалить кавычки вокруг названий
  cleaned = cleaned.replace(/["«»""]/g, "");

  // Заменить "et al." и "и соавт." на "и др."
  cleaned = cleaned.replace(/\bet\s+al\./gi, "и др.");
  cleaned = cleaned.replace(/и\s+соавт\./gi, "и др.");

  // Trim каждой строки
  cleaned = cleaned.trim();

  // Добавить точку в конце, если её нет
  if (cleaned && !cleaned.match(/[.!?]$/)) {
    cleaned += ".";
  }

  return cleaned;
}

/**
 * Разбивает текст на отдельные ссылки по переносам строк
 */
export function splitReferences(text: string): string[] {
  return text
    .split("\n")
    .map((line) => cleanText(line))
    .filter((line) => line.length > 0);
}

/**
 * Добавляет дату обращения для URL
 */
export function addAccessDate(text: string): string {
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;

  if (urlPattern.test(text) && !text.includes("дата обращения")) {
    return `${text} (дата обращения: ${dateStr})`;
  }

  return text;
}
