import { router } from '@/lib/server/trpc';
import { cardRouter } from './card';
import { userRoleRouter } from './userRole';

export const appRouter = router({
  card: cardRouter,
  userRole: userRoleRouter
});

export type AppRouter = typeof appRouter;
