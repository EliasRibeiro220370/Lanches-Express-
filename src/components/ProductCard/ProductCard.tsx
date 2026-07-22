import React from 'react';
import { Star, Clock, Plus, Heart, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../hooks/useStore';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.includes(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-neutral-800/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for Text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badge && !['mais pedido', 'novo', 'especial', 'promoção', 'promocao', 'economize até 20%'].some(b => product.badge?.toLowerCase().includes(b)) && (
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-md flex items-center gap-1 ${
                product.badge === 'Mais Pedido'
                  ? 'bg-amber-500 text-neutral-950'
                  : product.badge === 'Novo'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-red-600 text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {product.badge}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="px-2 py-1 rounded-lg text-[11px] font-extrabold bg-red-600 text-white shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Button Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-neutral-900/70 hover:bg-neutral-900 backdrop-blur border border-neutral-700/60 flex items-center justify-center transition-all"
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-pink-500 text-pink-500' : 'text-neutral-300 hover:text-white'
            }`}
          />
        </button>

        {/* Prep Time & Rating Bottom Left/Right on Image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-neutral-300 z-10">
          <span className="flex items-center gap-1 bg-neutral-950/70 px-2 py-0.5 rounded-md backdrop-blur">
            <Clock className="w-3 h-3 text-amber-400" />
            {product.prepTimeMinutes} min
          </span>
          <span className="flex items-center gap-1 bg-neutral-950/70 px-2 py-0.5 rounded-md backdrop-blur text-yellow-400">
            <Star className="w-3 h-3 fill-yellow-400" />
            {product.rating}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-neutral-700/60 flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through block font-medium">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-amber-400">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
