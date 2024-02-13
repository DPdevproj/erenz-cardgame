"use server";

import { revalidatePath } from "next/cache";
import { createCard, deleteCard, updateCard } from "@/lib/api/card/mutations";
import {
  CardId,
  NewCardParams,
  UpdateCardParams,
  cardIdSchema,
  insertCardParams,
  updateCardParams,
} from "@/lib/db/schema/card";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCards = () => revalidatePath("/card");

export const createCardAction = async (input: NewCardParams) => {
  try {
    const payload = insertCardParams.parse(input);
    await createCard(payload);
    revalidateCards();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCardAction = async (input: UpdateCardParams) => {
  try {
    const payload = updateCardParams.parse(input);
    await updateCard(payload.id, payload);
    revalidateCards();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCardAction = async (input: CardId) => {
  try {
    const payload = cardIdSchema.parse({ id: input });
    await deleteCard(payload.id);
    revalidateCards();
  } catch (e) {
    return handleErrors(e);
  }
};
