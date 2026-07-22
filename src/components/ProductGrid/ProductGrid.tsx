import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { ProductCard } from '../ProductCard/ProductCard';
import { ProductModal } from '../ProductModal/ProductModal';
import { CATEGORIES } from '../../data/categories';
import { Product } from '../../types';
import { SearchX, UtensilsCrossed } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, activeCategory, searchQuery, setSearchQuery, setActiveCategory } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by search and active category
  const filteredProducts = products.filter(product => {
    // Availability check
    if (!product.isAvailable) return false;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchIng = product.ingredients?.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIng) return false;
    }

    // Category check
    if (activeCategory !== 'todos' && product.categoryId !== activeCategory) {
      return false;
    }

    return true;
  });

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Category Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b border-neutral-800 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{currentCategoryObj ? currentCategoryObj.name : 'Nosso Cardápio'}</span>
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'}
            </span>
          </h2>
          {currentCategoryObj?.description && (
            <p className="text-sm text-neutral-400 mt-1">
              {currentCategoryObj.description}
            </p>
          )}
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <span>Filtrando por: <strong>"{searchQuery}"</strong></span>
            <button
              onClick={() => setSearchQuery('')}
              className="hover:underline font-bold text-white ml-1"
            >
              (Limpar)
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center my-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto text-amber-400 border border-neutral-700">
            {searchQuery ? <SearchX className="w-8 h-8" /> : <UtensilsCrossed className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Nenhum item encontrado</h3>
            <p className="text-xs text-neutral-400 mt-1">
              {searchQuery
                ? `Não encontramos lanches com os termos "${searchQuery}". Tente pesquisar por hambúrguer, batata ou bebida.`
                : 'Não há itens cadastrados nesta categoria no momento.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('todos');
            }}
            className="inline-flex items-center justify-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-white rounded-xl transition-all"
          >
            Ver Todos os Lanches
          </button>
        </div>
      )}

      {/* Customization Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};
