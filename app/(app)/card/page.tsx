import { Suspense } from "react";

import Loading from "@/app/loading";
import CardList from "@/components/card/CardList";
import { getCards } from "@/lib/api/card/queries";

export const revalidate = 0;

export default async function CardPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Card</h1>
        </div>
        <Cards />
      </div>
    </main>
  );
}

const Cards = async () => {
  const { cards } = await getCards();

  return (
    <Suspense fallback={<Loading />}>
      <CardList card={cards} />
    </Suspense>
  );
};
