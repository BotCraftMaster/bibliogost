import axios from "axios";
import { z } from "zod/v4";

import { env } from "../../env";
import { publicProcedure } from "../../trpc";

/**
 * Проверяет доступность GROBID сервера
 */
export const checkGrobidProcedure = publicProcedure
  .input(
    z.object({
      url: z.string().url().default(env.GROBID_URL),
    }),
  )
  .output(
    z.object({
      available: z.boolean(),
      message: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      await axios.get(`${input.url}/api/isalive`, { timeout: 5000 });
      return {
        available: true,
        message: "GROBID сервер доступен",
      };
    } catch {
      return {
        available: false,
        message: "GROBID сервер недоступен. Убедитесь, что сервер запущен.",
      };
    }
  });
