import { router } from "@/lib/server/trpc";
import { cardRouter } from "./card";

export const appRouter = router({
  card: cardRouter,
});

export type AppRouter = typeof appRouter;
