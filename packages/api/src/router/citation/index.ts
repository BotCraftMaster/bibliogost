import type { TRPCRouterRecord } from "@trpc/server";

import { checkGrobidProcedure } from "./check-grobid";
import { cleanProcedure } from "./clean";
import { processProcedure } from "./process";

export const citationRouter = {
  process: processProcedure,
  clean: cleanProcedure,
  checkGrobid: checkGrobidProcedure,
} satisfies TRPCRouterRecord;
