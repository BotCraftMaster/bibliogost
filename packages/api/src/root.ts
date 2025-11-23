import { citationRouter } from "./router/citation";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  citation: citationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
