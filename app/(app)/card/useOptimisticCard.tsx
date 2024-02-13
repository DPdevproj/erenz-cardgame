import { type Card, type CompleteCard } from '@/lib/db/schema/card';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddOptimistic = (action: OptimisticAction<Card>) => void;

export const useOptimisticCards = (card: CompleteCard[]) => {
  const [optimisticCards, addOptimisticCard] = useOptimistic(
    card,
    (currentState: CompleteCard[], action: OptimisticAction<Card>): CompleteCard[] => {
      const { data } = action;

      const optimisticCard = {
        ...data,

        id: 'optimistic'
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0 ? [optimisticCard] : [...currentState, optimisticCard];
        case 'update':
          return currentState.map((item) => (item.id === data.id ? { ...item, ...optimisticCard } : item));
        case 'delete':
          return currentState.map((item) => (item.id === data.id ? { ...item, id: 'delete' } : item));
        default:
          return currentState;
      }
    }
  );

  return { addOptimisticCard, optimisticCards };
};
