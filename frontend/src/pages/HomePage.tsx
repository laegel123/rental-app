import { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import itemService from '../services/itemService';
import type { ItemResponse } from '../services/itemService';

const HomePage = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await itemService.getAllItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sampleItems = [
    {
      id: 1,
      name: "Electric Lawn Mower",
      description: "Available for daily rental. Powerful and eco-friendly.",
      price: 15,
      imageUrl: "https://placehold.co/400x300?text=Lawn+Mower"
    },
    {
      id: 2,
      name: "Cordless Power Drill",
      description: "Comes with full bit set. Perfect for DIY projects.",
      price: 10,
      imageUrl: "https://placehold.co/400x300?text=Power+Drill"
    },
    {
      id: 3,
      name: "Camping Tent",
      description: "4-person tent, easy to set up. Waterproof.",
      price: 20,
      imageUrl: "https://placehold.co/400x300?text=Tent"
    },
    {
      id: 4,
      name: "Pressure Washer",
      description: "High-pressure washer for cleaning driveways and decks.",
      price: 25,
      imageUrl: "https://placehold.co/400x300?text=Pressure+Washer"
    }
  ];

  const displayItems = [...items, ...sampleItems.filter(si => !items.find(i => i.id === si.id))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <section className="mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Borrow what you need, lend what you don't.
          </h2>
          <SearchBar />
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Nearby Items</h3>
            <button className="text-teal-600 hover:text-teal-700 font-semibold">View all</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayItems.map(item => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
