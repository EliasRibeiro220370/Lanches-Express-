import React from 'react';
import { X, Clock, CheckCircle2, Package, Bike, Sparkles, MapPin, Phone } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { formatCurrency } from '../../utils/formatters';
import { OrderStatus } from '../../types';

export const OrderTrackerModal: React.FC = () => {
  const {
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    orders,
    activeOrderToTrack,
    setActiveOrderToTrack,
    updateOrderStatus
  } = useStore();

  if (!isOrderTrackerOpen) return null;

  const currentOrder = activeOrderToTrack || orders[0];

  if (!currentOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center text-white max-w-sm">
          <p className="font-bold text-base">Nenhum pedido recente para rastrear</p>
          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="mt-4 px-4 py-2 bg-neutral-800 rounded-xl text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'received', label: 'Pedido Recebido', icon: <Package className="w-4 h-4" /> },
    { status: 'preparing', label: 'Em Preparo', icon: <Clock className="w-4 h-4" /> },
    { status: 'delivery', label: 'Saiu p/ Entrega', icon: <Bike className="w-4 h-4" /> },
    { status: 'completed', label: 'Entregue!', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'delivery': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Rastreamento do Pedido #{currentOrder.id}</h2>
              <p className="text-xs text-neutral-400">Realizado às {currentOrder.createdAt}</p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders Selector if multiple exist */}
        {orders.length > 1 && (
          <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex gap-2 overflow-x-auto no-scrollbar">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrderToTrack(o)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  currentOrder.id === o.id
                    ? 'bg-amber-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                Pedido #{o.id} ({formatCurrency(o.total)})
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Status Timeline */}
          <div className="space-y-3">
            <p className="font-bold text-neutral-300 text-sm">Status Atual</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {statusSteps.map((s, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={s.status} className="flex flex-col items-center space-y-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-neutral-950 ring-4 ring-amber-500/20 scale-110 font-bold'
                          : isPassed
                          ? 'bg-emerald-500 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-amber-400' : isPassed ? 'text-emerald-400' : 'text-neutral-500'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Simulation controls for user / admin */}
          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2">
            <p className="font-bold text-neutral-300">Simular Atualização de Status (SaaS Demo)</p>
            <div className="flex gap-1.5 flex-wrap">
              {statusSteps.map((s) => (
                <button
                  key={s.status}
                  onClick={() => updateOrderStatus(currentOrder.id, s.status)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                    currentOrder.status === s.status
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="space-y-2 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <p className="font-bold text-white text-sm">Resumo dos Itens</p>
            <div className="space-y-1.5">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-neutral-300">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-bold">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between font-black text-sm text-amber-400">
              <span>Total Pago</span>
              <span>{formatCurrency(currentOrder.total)}</span>
            </div>
          </div>

          {/* Customer Delivery info */}
          <div className="space-y-1 text-neutral-400 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <p className="font-bold text-white mb-1">Cliente & Entrega</p>
            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> {currentOrder.customer.name} ({currentOrder.customer.phone})</p>
            {currentOrder.customer.deliveryType === 'delivery' && (
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-400" /> {currentOrder.customer.address}, Nº {currentOrder.customer.number} - {currentOrder.customer.neighborhood}</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
