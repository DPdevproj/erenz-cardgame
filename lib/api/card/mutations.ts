import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  CardId,
  NewCardParams,
  UpdateCardParams,
  updateCardSchema,
  insertCardSchema,
  card,
  cardIdSchema
} from '@/lib/db/schema/card';

export const createCard = async (newcard: NewCardParams) => {
  const newCard = insertCardSchema.parse(newcard);
  try {
    await db.insert(card).values(newCard);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateCard = async (id: CardId, newcard: UpdateCardParams) => {
  const { id: cardId } = cardIdSchema.parse({ id });
  const newCard = updateCardSchema.parse(newcard);
  try {
    await db
      .update(card)
      .set({ ...newCard, updatedAt: new Date() })
      .where(eq(card.id, cardId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteCard = async (id: CardId) => {
  const { id: cardId } = cardIdSchema.parse({ id });
  try {
    await db.delete(card).where(eq(card.id, cardId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
