import { z } from "zod/v4";

import type { CslStyle } from "../../utils/citeproc-formatter";
import { env } from "../../env";
import { publicProcedure } from "../../trpc";
import {
  checkMissingFields,
  formatReferences,
} from "../../utils/citeproc-formatter";
import { convertToCiteproc, parseWithGrobid } from "../../utils/grobid-client";
import { addAccessDate, splitReferences } from "../../utils/text-cleaner";

/**
 * Схема для обработки цитирований
 */
const ProcessCitationsSchema = z.object({
  text: z.string().min(1, "Текст не может быть пустым"),
  style: z.enum(["gost-2008", "gost-2018"]).default("gost-2018"),
  grobidUrl: z.string().url().optional().default(env.GROBID_URL),
});

/**
 * Результат обработки одной ссылки
 */
const CitationResultSchema = z.object({
  original: z.string(),
  formatted: z.string(),
  warnings: z.array(z.string()),
  success: z.boolean(),
});

/**
 * Обрабатывает "грязный" текст с библиографическими ссылками
 *
 * Алгоритм:
 * 1. Пользователь вставляет текст
 * 2. Текст очищается от мусора (нумерация, символы, кавычки)
 * 3. Текст разбивается на строки по \n
 * 4. Каждая строка отправляется в GROBID
 * 5. GROBID возвращает TEI XML
 * 6. XML преобразуется в формат citeproc-js
 * 7. citeproc-js применяет выбранный CSL-стиль (ГОСТ 2008 или 2018)
 * 8. Результат выводится в поле
 * 9. При наличии недостающих данных показывается предупреждение
 */
export const processProcedure = publicProcedure
  .input(ProcessCitationsSchema)
  .output(
    z.object({
      results: z.array(CitationResultSchema),
      totalProcessed: z.number(),
      totalSuccess: z.number(),
      totalWarnings: z.number(),
    }),
  )
  .mutation(async ({ input }) => {
    const { text, style, grobidUrl } = input;

    // Шаг 1-2: Очистка и разбивка текста
    const references = splitReferences(text);

    if (references.length === 0) {
      return {
        results: [],
        totalProcessed: 0,
        totalSuccess: 0,
        totalWarnings: 0,
      };
    }

    // Шаг 3-5: Обработка каждой ссылки
    const results = await Promise.all(
      references.map(async (ref, index) => {
        try {
          // Добавляем дату обращения для URL
          const refWithDate = addAccessDate(ref);
          // Парсим через GROBID
          const grobidResult = await parseWithGrobid(refWithDate, grobidUrl);
          // Конвертируем в citeproc формат
          const citeprocRef = convertToCiteproc(grobidResult, `ref-${index}`);

          // Проверяем недостающие поля
          const missingFields = checkMissingFields(citeprocRef);
          const warnings: string[] = [];

          if (missingFields.length > 0) {
            warnings.push(`Отсутствуют поля: ${missingFields.join(", ")}`);
          }

          // Форматируем
          const formatted = formatReferences([citeprocRef], style as CslStyle);

          return {
            original: ref,
            formatted: formatted[0] ?? ref,
            warnings,
            success: true,
          };
        } catch (error) {
          console.error(`Error processing reference ${index}:`, error);
          return {
            original: ref,
            formatted: ref,
            warnings: ["Ошибка обработки ссылки"],
            success: false,
          };
        }
      }),
    );

    // Подсчет статистики
    const totalSuccess = results.filter((r) => r.success).length;
    const totalWarnings = results.reduce(
      (sum, r) => sum + r.warnings.length,
      0,
    );

    return {
      results,
      totalProcessed: references.length,
      totalSuccess,
      totalWarnings,
    };
  });
