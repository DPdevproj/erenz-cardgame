'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/card/useOptimisticCard';
import { type Card } from '@/lib/db/schema/card';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import CardForm from '@/components/card/CardForm';

export default function OptimisticCard({ card }: { card: Card }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Card) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCard, setOptimisticCard] = useOptimistic(card);
  const updateCard: TAddOptimistic = (input) => setOptimisticCard({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CardForm card={card} closeModal={closeModal} openModal={openModal} addOptimistic={updateCard} />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{card.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticCard.id === 'optimistic' ? 'animate-pulse' : ''
        )}
      >
        {JSON.stringify(optimisticCard, null, 2)}
      </pre>
    </div>
  );
}
