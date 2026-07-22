import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

export const CartButton: React.FC = () => {
  const { totalItemsCount, total, setIsCartOpen } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <div className="fixed bottom-2.5 right-6 z-40">
      <button
        onClick={() => setIsCartOpen(true)}
        className="group flex items-center gap-3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-red-950/60 ring-2 ring-red-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-white text-red-600 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
            {totalItemsCount}
          </span>
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] uppercase font-extrabold text-amber-200 tracking-wider">
            Ver Carrinho
          </span>
          <span className="text-sm font-black">
            {formatCurrency(total)}
          </span>
        </div>
      </button>
    </div>
  );
};
