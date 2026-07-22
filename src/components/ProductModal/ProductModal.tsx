import React, { useState } from 'react';
import { X, Plus, Minus, Star, Clock, ShoppingBag, Check } from 'lucide-react';
import { Product, SelectedCustomization } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  // Local customization state
  const [quantity, setQuantity] = useState(1);
  const [selectedDoneness, setSelectedDoneness] = useState<string>('Ao Ponto');
  const [selectedBread, setSelectedBread] = useState<string>('Pão Brioche Tostado');
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([]);
  const [observation, setObservation] = useState<string>('');

  // Is hamburger or combo with meat point
  const isBurgerOrCombo = product.categoryId === 'hamburgueres' || product.categoryId === 'combos';

  const handleToggleCustomizationOption = (
    groupId: string,
    groupTitle: string,
    option: { id: string; name: string; price: number }
  ) => {
    setSelectedCustomizations(prev => {
      const exists = prev.some(item => item.optionId === option.id);
      if (exists) {
        return prev.filter(item => item.optionId !== option.id);
      } else {
        return [
          ...prev,
          {
            groupId,
            groupTitle,
            optionId: option.id,
            optionName: option.name,
            price: option.price
          }
        ];
      }
    });
  };

  // Calculate unit price
  const extrasTotalPrice = selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
  const unitPrice = product.price + extrasTotalPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const cartItemId = `item-${product.id}-${Date.now()}`;
    addToCart({
      cartItemId,
      product,
      quantity,
      selectedDoneness: isBurgerOrCombo ? selectedDoneness : undefined,
      selectedBread: isBurgerOrCombo ? selectedBread : undefined,
      selectedCustomizations,
      observation: observation.trim() ? observation.trim() : undefined,
      unitPrice,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 w-full bg-neutral-950 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Info Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {product.badge && !['mais pedido', 'novo', 'especial', 'promoção', 'promocao', 'economize até 20%'].some(b => product.badge?.toLowerCase().includes(b)) && (
                  <span className="bg-amber-500 text-neutral-950 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">
                    {product.badge}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-yellow-400 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {product.rating}
                </span>
                <span className="flex items-center gap-1 text-xs text-neutral-300 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {product.prepTimeMinutes} min
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {product.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Description */}
          <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>

          {/* Ingredients list */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Ingredientes Principais
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-900 border border-neutral-700 text-neutral-300 px-2.5 py-1 rounded-lg text-xs"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customization 1: Meat Doneness (Ponto da carne) */}
          {isBurgerOrCombo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200">
                  Ponto da Carne
                </label>
                <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
                  Obrigatório
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Ao Ponto', 'Bem Passado', 'Mal Passado'].map((ponto) => (
                  <button
                    key={ponto}
                    type="button"
                    onClick={() => setSelectedDoneness(ponto)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedDoneness === ponto
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    {ponto}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization 2: Bread Type */}
          {isBurgerOrCombo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200">
                  Escolha o Pão
                </label>
                <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
                  Obrigatório
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Pão Brioche Tostado', price: 0 },
                  { name: 'Pão Australiano', price: 2.50 },
                  { name: 'Pão com Gergelim', price: 0 }
                ].map((bread) => (
                  <button
                    key={bread.name}
                    type="button"
                    onClick={() => setSelectedBread(bread.name)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedBread === bread.name
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    <span>{bread.name}</span>
                    <span className="text-neutral-400">
                      {bread.price > 0 ? `+ ${formatCurrency(bread.price)}` : 'Grátis'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customizations from product data */}
          {product.customizations && product.customizations.map((group) => (
            <div key={group.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200">
                  {group.title}
                </label>
                <span className="text-xs text-neutral-400">Opcional</span>
              </div>
              <div className="space-y-2">
                {group.options.map((opt) => {
                  const isChecked = selectedCustomizations.some(c => c.optionId === opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleCustomizationOption(group.id, group.title, opt)}
                      className={`cursor-pointer p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-medium">{opt.name}</span>
                      </div>
                      <span className="font-bold text-amber-400">
                        {opt.price > 0 ? `+ ${formatCurrency(opt.price)}` : 'Grátis'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Observations input */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-200 block text-xs">
              Observações Especiais
            </label>
            <textarea
              rows={2}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Tirar cebola, maionese à parte, sem picles..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Quantity Selector */}
          <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-xl p-1.5">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-extrabold text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-lg bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit Button */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 flex items-center justify-between bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-red-900/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Adicionar ao Carrinho</span>
            </div>
            <span className="text-base font-black">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
