import { cards } from "@/components/HomeGrid/cards";
import { HomeCard } from "@/components/HomeGrid/HomeCard";

export default async function Home() {
  return (
    <div className="flex flex-wrap gap-4 m-4 ">
      {cards.map((card) => (
        <HomeCard data={card} key={card.title} />
      ))}
    </div>
  );
}
