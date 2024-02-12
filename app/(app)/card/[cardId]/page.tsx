import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCardById } from "@/lib/api/card/queries";
import OptimisticCard from "./OptimisticCard";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CardPage({
  params,
}: {
  params: { cardId: string };
}) {

  return (
    <main className="overflow-auto">
      <Card id={params.cardId} />
    </main>
  );
}

const Card = async ({ id }: { id: string }) => {
  
  const { card } = await getCardById(id);
  

  if (!card) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="card" />
        <OptimisticCard card={card}  />
      </div>
    </Suspense>
  );
};
