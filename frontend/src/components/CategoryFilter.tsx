import React from 'react';
import { Pizza, Coffee, Pizza as Burger, Leaf, Drumstick, IceCream, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'All', name: 'All Menu', icon: <Utensils className="w-5 h-5" /> },
  { id: 'Veg Main Course', name: 'Veg Main', icon: <Leaf className="w-5 h-5" /> },
  { id: 'Non-Veg Main Course', name: 'Non-Veg', icon: <Drumstick className="w-5 h-5" /> },
  { id: 'Pizza', name: 'Pizza', icon: <Pizza className="w-5 h-5" /> },
  { id: 'Burgers', name: 'Burgers', icon: <Burger className="w-5 h-5" /> },
  { id: 'Desserts', name: 'Desserts', icon: <IceCream className="w-5 h-5" /> },
  { id: 'Drinks', name: 'Drinks', icon: <Coffee className="w-5 h-5" /> },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-md border ${
            selectedCategory === category.id
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200 hover:text-orange-600'
          }`}
        >
          {category.icon}
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
