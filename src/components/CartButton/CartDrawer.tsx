import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Ticket,
  Bike,
  Store,
  CreditCard,
  QrCode,
  Coins,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useStore } from '../../hooks/useStore';
import { formatCurrency } from '../../utils/formatters';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';
import { CustomerDetails, Order, PaymentMethod, DeliveryType } from '../../types';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    deliveryFee,
    total,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const { store, addOrder } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Customer Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    address: '',
    number: '',
    neighborhood: '',
    complement: '',
    deliveryType: 'delivery',
    paymentMethod: 'pix',
    cashChangeFor: undefined,
    observation: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.name.trim()) errors.name = 'Informe seu nome';
    if (!customer.phone.trim() || customer.phone.length < 8) errors.phone = 'Informe seu telefone de WhatsApp';

    if (customer.deliveryType === 'delivery') {
      if (!customer.address.trim()) errors.address = 'Informe a rua/avenida';
      if (!customer.number.trim()) errors.number = 'Informe o número';
      if (!customer.neighborhood.trim()) errors.neighborhood = 'Informe o bairro';
    }

    if (customer.paymentMethod === 'cash' && customer.cashChangeFor) {
      if (customer.cashChangeFor < total) {
        errors.cashChangeFor = `O valor do troco deve ser maior que o total (${formatCurrency(total)})`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCompleteOrder = () => {
    if (!validateForm()) return;

    const orderId = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      customer: { ...customer },
      subtotal,
      deliveryFee: customer.deliveryType === 'delivery' ? deliveryFee : 0,
      discount: discountAmount,
      total: customer.deliveryType === 'delivery' ? total : subtotal - discountAmount,
      status: 'received',
      estimatedTime: '30-45 min'
    };

    // Save order in context order history
    addOrder(newOrder);

    // Generate WhatsApp link and redirect
    const waUrl = generateWhatsAppOrderUrl({
      items,
      customer,
      store,
      subtotal,
      deliveryFee: customer.deliveryType === 'delivery' ? deliveryFee : 0,
      discount: discountAmount,
      total: customer.deliveryType === 'delivery' ? total : subtotal - discountAmount,
      orderId
    });

    window.open(waUrl, '_blank');

    // Reset drawer state
    clearCart();
    setStep('cart');
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-white flex flex-col shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-white">
                  {step === 'cart' ? 'Seu Carrinho' : 'Finalizar Pedido'}
                </h2>
                <p className="text-xs text-neutral-400">
                  {step === 'cart' ? `${items.length} itens selecionados` : 'Preencha os dados de entrega'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Seu carrinho está vazio</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Adicione hambúrgueres artesanais, porções e bebidas para fazer seu pedido!
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Explorar Cardápio
              </button>
            </div>
          ) : step === 'cart' ? (
            /* STEP 1: CART ITEMS REVIEW */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="bg-neutral-800/80 border border-neutral-700/80 p-3.5 rounded-2xl flex gap-3 text-xs"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-neutral-900"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-white text-sm">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customizations tags */}
                      <div className="text-[11px] text-neutral-400 space-y-0.5">
                        {item.selectedDoneness && <div>• Ponto: {item.selectedDoneness}</div>}
                        {item.selectedBread && <div>• Pão: {item.selectedBread}</div>}
                        {item.selectedCustomizations.map((c, i) => (
                          <div key={i}>• {c.optionName} (+{formatCurrency(c.price)})</div>
                        ))}
                        {item.observation && <div className="italic text-amber-300">Obs: "{item.observation}"</div>}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-extrabold text-amber-400 text-sm">
                          {formatCurrency(item.totalPrice)}
                        </span>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Application Box */}
              <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-200 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    Cupom de Desconto
                  </span>
                  <span className="text-[10px] text-neutral-400">Ex: LANCHE10, ELIASVIP</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-emerald-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="font-bold">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-emerald-300">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-400 hover:underline font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Código do cupom"
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold text-amber-400 rounded-xl transition-all"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {couponFeedback && !appliedCoupon && (
                  <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

            </div>
          ) : (
            /* STEP 2: CHECKOUT & CUSTOMER DETAILS FORM */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* Delivery Type Switcher */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-300 block">Tipo de Pedido</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomer(prev => ({ ...prev, deliveryType: 'delivery' }))}
                    className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      customer.deliveryType === 'delivery'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Entrega (Delivery)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomer(prev => ({ ...prev, deliveryType: 'pickup' }))}
                    className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      customer.deliveryType === 'pickup'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Retirada no Balcão</span>
                  </button>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-2 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
                <p className="font-bold text-neutral-200">Seus Dados</p>

                <div>
                  <label className="text-neutral-400 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {formErrors.name && <p className="text-red-400 text-[10px] mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-8888"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {formErrors.phone && <p className="text-red-400 text-[10px] mt-0.5">{formErrors.phone}</p>}
                </div>
              </div>

              {/* Address Form (if delivery) */}
              {customer.deliveryType === 'delivery' && (
                <div className="space-y-2 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
                  <p className="font-bold text-neutral-200">Endereço de Entrega</p>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-neutral-400 block mb-1">Rua / Avenida *</label>
                      <input
                        type="text"
                        value={customer.address}
                        onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Ex: Av. Paulista"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      {formErrors.address && <p className="text-red-400 text-[10px] mt-0.5">{formErrors.address}</p>}
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Número *</label>
                      <input
                        type="text"
                        value={customer.number}
                        onChange={(e) => setCustomer(prev => ({ ...prev, number: e.target.value }))}
                        placeholder="100"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      {formErrors.number && <p className="text-red-400 text-[10px] mt-0.5">{formErrors.number}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={customer.neighborhood}
                        onChange={(e) => setCustomer(prev => ({ ...prev, neighborhood: e.target.value }))}
                        placeholder="Bairro"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      {formErrors.neighborhood && <p className="text-red-400 text-[10px] mt-0.5">{formErrors.neighborhood}</p>}
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Complemento</label>
                      <input
                        type="text"
                        value={customer.complement}
                        onChange={(e) => setCustomer(prev => ({ ...prev, complement: e.target.value }))}
                        placeholder="Apt 12B"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-2 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
                <p className="font-bold text-neutral-200">Forma de Pagamento</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: 'pix' }))}
                    className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                      customer.paymentMethod === 'pix'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>PIX</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: 'card_delivery' }))}
                    className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                      customer.paymentMethod === 'card_delivery'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: 'cash' }))}
                    className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                      customer.paymentMethod === 'cash'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>Dinheiro</span>
                  </button>
                </div>

                {customer.paymentMethod === 'cash' && (
                  <div className="pt-2">
                    <label className="text-neutral-400 block mb-1">Troco para quanto?</label>
                    <input
                      type="number"
                      placeholder="Ex: 100"
                      value={customer.cashChangeFor || ''}
                      onChange={(e) => setCustomer(prev => ({ ...prev, cashChangeFor: Number(e.target.value) }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {formErrors.cashChangeFor && (
                      <p className="text-red-400 text-[10px] mt-0.5">{formErrors.cashChangeFor}</p>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Drawer Footer Totals & Action */}
          <div className="p-4 bg-neutral-950 border-t border-neutral-800 space-y-3 shrink-0">
            
            {/* Price Calculations Summary */}
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {customer.deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Taxa de Entrega</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : ''}>
                    {deliveryFee > 0 ? formatCurrency(deliveryFee) : 'GRÁTIS'}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Desconto (Cupom)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm font-black text-white">
                <span>Total a Pagar</span>
                <span className="text-amber-400 text-base">
                  {formatCurrency(customer.deliveryType === 'delivery' ? total : subtotal - discountAmount)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {step === 'cart' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
                >
                  <span>Avançar para Entrega</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl"
                >
                  Voltar
                </button>
                <button
                  onClick={handleCompleteOrder}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido no WhatsApp</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
