import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { useStore } from '../../hooks/useStore';
import { CategoryId } from '../../types';
import {
  Utensils,
  Flame,
  Beef,
  GlassWater,
  IceCream,
  Droplets,
  Sparkles,
  Layers
} from 'lucide-react';

export const CategoryMenu: React.FC = () => {
  const { activeCategory, setActiveCategory, products } = useStore();

  const getCategoryCount = (id: CategoryId) => {
    if (id === 'todos') return products.length;
    return products.filter(p => p.categoryId === id).length;
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-3 h-3" />;
      case 'Burger':
        return <Beef className="w-3 h-3" />;
      case 'FryingPan':
        return <Layers className="w-3 h-3" />;
      case 'CupSoda':
        return <GlassWater className="w-3 h-3" />;
      case 'IceCream':
        return <IceCream className="w-3 h-3" />;
      case 'Droplet':
        return <Droplets className="w-3 h-3" />;
      default:
        return <Utensils className="w-3 h-3" />;
    }
  };

  return (
    <div className="sticky top-[69px] z-30 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shadow-md">
      <div className="max-w-7xl mx-auto px-1.5 sm:px-3 lg:px-6 py-1.5">
        
        {/* Category Scroll Container */}
        <div className="flex items-center justify-start md:justify-between gap-1 overflow-x-auto no-scrollbar scroll-smooth pb-0.5 -mx-1.5 px-1.5 sm:mx-0 sm:px-0">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            const count = getCategoryCount(category.id);

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative group flex items-center gap-1 px-2 py-1 rounded-md font-medium text-[10px] sm:text-[11px] lg:text-xs whitespace-nowrap transition-all duration-200 shrink-0 border ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-red-500/50 shadow-sm shadow-red-900/30 scale-[1.01]'
                    : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700/80'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-amber-400 group-hover:scale-110 transition-transform'}>
                  {renderIcon(category.icon)}
                </span>
                
                <span>{category.name}</span>

                <span
                  className={`px-1 py-0.2 rounded-full text-[8px] font-bold ${
                    isActive
                      ? 'bg-black/30 text-white'
                      : 'bg-neutral-700/90 text-neutral-300'
                  }`}
                >
                  {count}
                </span>

                {category.badge && !['economize', 'promoção', 'promocao'].some(b => category.badge?.toLowerCase().includes(b)) && (
                  <span className="hidden md:inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-extrabold bg-amber-400 text-neutral-950 uppercase">
                    <Sparkles className="w-2 h-2" />
                    {category.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
