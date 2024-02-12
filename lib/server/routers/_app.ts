import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { cardRouter } from "./card";

export const appRouter = router({
  computers: computersRouter,
  card: cardRouter,
});

export type AppRouter = typeof appRouter;
