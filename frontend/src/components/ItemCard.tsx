import React from 'react';
import Button from './Button';

interface ItemCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  id, 
  name, 
  description, 
  price, 
  imageUrl = "https://placehold.co/400x300?text=Item" 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4 flex flex-col h-full">
        <h3 className="font-bold text-lg mb-2 truncate text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-teal-600">
              ${price}
              <span className="text-sm font-normal text-gray-500">/day</span>
            </span>
          </div>
          <Button variant="primary" size="sm">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
