import { cards } from '@/app/components/cards';
import { HomeCard } from './components/home-card';

export default function Home() {
  return (
    <div className='flex flex-wrap gap-4 m-4 '>
      {cards.map((card) => (
        <HomeCard data={card} key={card.title} />
      ))}
    </div>
  );
}
