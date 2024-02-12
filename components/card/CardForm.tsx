import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/card/useOptimisticCards";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import { Checkbox } from "@/components/ui/checkbox"

import { type Card, insertCardParams } from "@/lib/db/schema/card";
import {
  createCardAction,
  deleteCardAction,
  updateCardAction,
} from "@/lib/actions/card";


const CardForm = ({
  
  card,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  card?: Card | null;
  
  openModal?: (card?: Card) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Card>(insertCardParams);
  const editing = !!card?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("card");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Card },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Card ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const cardParsed = await insertCardParams.safeParseAsync({  ...payload });
    if (!cardParsed.success) {
      setErrors(cardParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = cardParsed.data;
    const pendingCard: Card = {
      updatedAt: card?.updatedAt ?? new Date(),
      createdAt: card?.createdAt ?? new Date(),
      id: card?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingCard,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateCardAction({ ...values, id: card.id })
          : await createCardAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingCard 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={card?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.expansion ? "text-destructive" : "",
          )}
        >
          Expansion
        </Label>
        <Input
          type="text"
          name="expansion"
          className={cn(errors?.expansion ? "ring ring-destructive" : "")}
          defaultValue={card?.expansion ?? ""}
        />
        {errors?.expansion ? (
          <p className="text-xs text-destructive mt-2">{errors.expansion[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.rarity ? "text-destructive" : "",
          )}
        >
          Rarity
        </Label>
        <Input
          type="text"
          name="rarity"
          className={cn(errors?.rarity ? "ring ring-destructive" : "")}
          defaultValue={card?.rarity ?? ""}
        />
        {errors?.rarity ? (
          <p className="text-xs text-destructive mt-2">{errors.rarity[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.language ? "text-destructive" : "",
          )}
        >
          Language
        </Label>
        <Input
          type="text"
          name="language"
          className={cn(errors?.language ? "ring ring-destructive" : "")}
          defaultValue={card?.language ?? ""}
        />
        {errors?.language ? (
          <p className="text-xs text-destructive mt-2">{errors.language[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.info ? "text-destructive" : "",
          )}
        >
          Info
        </Label>
        <Input
          type="text"
          name="info"
          className={cn(errors?.info ? "ring ring-destructive" : "")}
          defaultValue={card?.info ?? ""}
        />
        {errors?.info ? (
          <p className="text-xs text-destructive mt-2">{errors.info[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.quantity ? "text-destructive" : "",
          )}
        >
          Quantity
        </Label>
        <Input
          type="text"
          name="quantity"
          className={cn(errors?.quantity ? "ring ring-destructive" : "")}
          defaultValue={card?.quantity ?? ""}
        />
        {errors?.quantity ? (
          <p className="text-xs text-destructive mt-2">{errors.quantity[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.price ? "text-destructive" : "",
          )}
        >
          Price
        </Label>
        <Input
          type="text"
          name="price"
          className={cn(errors?.price ? "ring ring-destructive" : "")}
          defaultValue={card?.price ?? ""}
        />
        {errors?.price ? (
          <p className="text-xs text-destructive mt-2">{errors.price[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.condition ? "text-destructive" : "",
          )}
        >
          Condition
        </Label>
        <Input
          type="text"
          name="condition"
          className={cn(errors?.condition ? "ring ring-destructive" : "")}
          defaultValue={card?.condition ?? ""}
        />
        {errors?.condition ? (
          <p className="text-xs text-destructive mt-2">{errors.condition[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
<div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.available ? "text-destructive" : "",
          )}
        >
          Available
        </Label>
        <br />
        <Checkbox defaultChecked={card?.available} name={'available'} className={cn(errors?.available ? "ring ring-destructive" : "")} />
        {errors?.available ? (
          <p className="text-xs text-destructive mt-2">{errors.available[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: card });
              const error = await deleteCardAction(card.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: card,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default CardForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
