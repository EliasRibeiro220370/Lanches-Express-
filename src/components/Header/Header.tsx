import React from 'react';
import { Search, ShoppingBag, Clock, Settings, MapPin, Heart, PackageCheck } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useCart } from '../../hooks/useCart';

export const Header: React.FC = () => {
  const {
    store,
    searchQuery,
    setSearchQuery,
    favorites,
    setIsStoreSettingsOpen,
    orders,
    setIsOrderTrackerOpen,
    setActiveCategory
  } = useStore();

  const { totalItemsCount, setIsCartOpen } = useCart();

  const [logoClicks, setLogoClicks] = React.useState(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    setActiveCategory('todos');

    const nextCount = logoClicks + 1;
    if (nextCount >= 5) {
      setLogoClicks(0);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      setIsStoreSettingsOpen(true);
    } else {
      setLogoClicks(nextCount);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        setLogoClicks(0);
      }, 3000);
    }
  };

  const hasActiveOrders = orders.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Store Name */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="relative">
              <img
                src={store.logoUrl}
                alt={store.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover ring-2 ring-red-500/40 shadow-md active:scale-95 transition-transform"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900 ${
                  store.isOpen ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                title={store.isOpen ? 'Aberto para pedidos' : 'Fechado'}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-white tracking-tight leading-tight">
                  {store.name}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  EXPRESS
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {store.openingHours}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:flex items-center gap-1 text-neutral-400 truncate max-w-[180px]">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  {store.neighborhoodCity}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Center Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar x-bacon, batata, refrigerante..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-800/80 border border-neutral-700/80 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Orders Tracker button if orders exist */}
            {hasActiveOrders && (
              <button
                onClick={() => setIsOrderTrackerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl transition-all animate-pulse"
                title="Acompanhar Pedidos"
              >
                <PackageCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Meus Pedidos ({orders.length})</span>
              </button>
            )}

            {/* Favorites Counter indicator */}
            {favorites.length > 0 && (
              <div
                className="hidden lg:flex items-center gap-1 px-2.5 py-2 text-xs bg-neutral-800 text-pink-400 rounded-xl border border-neutral-700"
                title="Favoritos"
              >
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                <span>{favorites.length}</span>
              </div>
            )}

            {/* Cart Button Header */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-red-900/30 transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Carrinho</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-red-600 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-3 md:hidden relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por lanches, bebidas ou acompanhamentos..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400"
            >
              Limpar
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
