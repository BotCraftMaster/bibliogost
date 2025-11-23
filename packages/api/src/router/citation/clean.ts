import { z } from "zod/v4";

import { publicProcedure } from "../../trpc";
import { splitReferences } from "../../utils/text-cleaner";

/**
 * Очищает текст без полной обработки (для предпросмотра)
 */
export const cleanProcedure = publicProcedure
  .input(
    z.object({
      text: z.string(),
    }),
  )
  .output(
    z.object({
      cleaned: z.string(),
      references: z.array(z.string()),
    }),
  )
  .query(({ input }) => {
    const references = splitReferences(input.text);
    const cleaned = references.join("\n");

    return {
      cleaned,
      references,
    };
  });
