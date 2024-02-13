import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type CardId, cardIdSchema, card } from "@/lib/db/schema/card";

export const getCards = async () => {
  const rows = await db.select().from(card);
  const c = rows;
  return { cards: c };
};

export const getCardById = async (id: CardId) => {
  const { id: cardId } = cardIdSchema.parse({ id });
  const [row] = await db.select().from(card).where(eq(card.id, cardId));
  if (row === undefined) return {};
  const c = row;
  return { card: c };
};
