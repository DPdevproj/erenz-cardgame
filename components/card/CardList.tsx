"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Card, CompleteCard } from "@/lib/db/schema/card";
import Modal from "@/components/shared/Modal";

import { Button } from "@/components/ui/button";
import CardForm from "./CardForm";
import { PlusIcon } from "lucide-react";
import { useOptimisticCards } from "@/app/(app)/card/useOptimisticCard";

type TOpenModal = (card?: Card) => void;

export default function CardList({ card }: { card: CompleteCard[] }) {
  const { optimisticCards, addOptimisticCard } = useOptimisticCards(card);
  const [open, setOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const openModal = (card?: Card) => {
    setOpen(true);
    card ? setActiveCard(card) : setActiveCard(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCard ? "Edit Card" : "Create Card"}
      >
        <CardForm
          card={activeCard}
          addOptimistic={addOptimisticCard}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCards.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCards.map((card) => (
            <Card card={card} key={card.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Card = ({
  card,
  openModal,
}: {
  card: CompleteCard;
  openModal: TOpenModal;
}) => {
  const optimistic = card.id === "optimistic";
  const deleting = card.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("card") ? pathname : pathname + "/card/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{card.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + card.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No card
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new card.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Card{" "}
        </Button>
      </div>
    </div>
  );
};
