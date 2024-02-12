import { getCardById, getCard } from "@/lib/api/card/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  cardIdSchema,
  insertCardParams,
  updateCardParams,
} from "@/lib/db/schema/card";
import { createCard, deleteCard, updateCard } from "@/lib/api/card/mutations";

export const cardRouter = router({
  getCard: publicProcedure.query(async () => {
    return getCard();
  }),
  getCardById: publicProcedure.input(cardIdSchema).query(async ({ input }) => {
    return getCardById(input.id);
  }),
  createCard: publicProcedure
    .input(insertCardParams)
    .mutation(async ({ input }) => {
      return createCard(input);
    }),
  updateCard: publicProcedure
    .input(updateCardParams)
    .mutation(async ({ input }) => {
      return updateCard(input.id, input);
    }),
  deleteCard: publicProcedure
    .input(cardIdSchema)
    .mutation(async ({ input }) => {
      return deleteCard(input.id);
    }),
});
