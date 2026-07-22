import React from 'react';
import { Bike, Clock, Star, Flame, Ticket, ShieldCheck } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

export const Hero: React.FC = () => {
  const { store } = useStore();
  const { applyCoupon } = useCart();
  const [copiedCoupon, setCopiedCoupon] = React.useState<string | null>(null);

  const handleCopyCoupon = (code: string) => {
    applyCoupon(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  return (
    <div className="relative bg-neutral-900 border-b border-neutral-800 text-white overflow-hidden">
      {/* Background Banner with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={store.bannerUrl}
          alt="Hero Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 filter blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>CARDÁPIO DIGITAL INTERATIVO • SHOWCASE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Os Melhores Lanches da Cidade, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-orange-400">Entregues Quentinhos</span> na Sua Porta!
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {store.slogan}. Blends artesanais, ingredientes frescos e entrega expressa com o melhor atendimento da região.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-neutral-800/80 backdrop-blur border border-neutral-700/60 p-3 rounded-xl flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Tempo Médio</p>
                  <p className="text-xs font-semibold text-white">25 - 40 min</p>
                </div>
              </div>

              <div className="bg-neutral-800/80 backdrop-blur border border-neutral-700/60 p-3 rounded-xl flex items-center gap-2.5">
                <Bike className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Entrega</p>
                  <p className="text-xs font-semibold text-white">
                    {store.deliveryFee > 0 ? formatCurrency(store.deliveryFee) : 'Grátis'}
                  </p>
                </div>
              </div>

              <div className="bg-neutral-800/80 backdrop-blur border border-neutral-700/60 p-3 rounded-xl flex items-center gap-2.5">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Avaliação</p>
                  <p className="text-xs font-semibold text-white">4.9 ★ (1.2k+)</p>
                </div>
              </div>

              <div className="bg-neutral-800/80 backdrop-blur border border-neutral-700/60 p-3 rounded-xl flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Pedido Mínimo</p>
                  <p className="text-xs font-semibold text-white">{formatCurrency(store.minOrderValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coupons & Special Offers Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-neutral-800/90 via-neutral-800/60 to-neutral-900/90 border border-neutral-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white">Cupons Especiais Ativos</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Clique para usar
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Coupon 1 */}
                <button
                  type="button"
                  onClick={() => handleCopyCoupon('LANCHE10')}
                  aria-label="Aplicar cupom LANCHE10 de 10% de desconto"
                  className="w-full text-left group cursor-pointer bg-neutral-900/80 hover:bg-neutral-900 border border-dashed border-amber-500/40 hover:border-amber-500 p-3 rounded-xl flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-amber-400 text-sm">LANCHE10</span>
                      <span className="text-[10px] bg-amber-400/10 text-amber-300 font-medium px-1.5 py-0.5 rounded">10% OFF</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">10% de desconto no valor total dos lanches</p>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold group-hover:underline shrink-0">
                    {copiedCoupon === 'LANCHE10' ? '✓ Aplicado' : 'Aplicar'}
                  </span>
                </button>

                {/* Coupon 2 */}
                <button
                  type="button"
                  onClick={() => handleCopyCoupon('FRETEGRATIS')}
                  aria-label="Aplicar cupom FRETEGRATIS para frete grátis"
                  className="w-full text-left group cursor-pointer bg-neutral-900/80 hover:bg-neutral-900 border border-dashed border-emerald-500/40 hover:border-emerald-500 p-3 rounded-xl flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-emerald-400 text-sm">FRETEGRATIS</span>
                      <span className="text-[10px] bg-emerald-400/10 text-emerald-300 font-medium px-1.5 py-0.5 rounded">Frete R$ 0</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">Desconto no valor do frete de entrega</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold group-hover:underline shrink-0">
                    {copiedCoupon === 'FRETEGRATIS' ? '✓ Aplicado' : 'Aplicar'}
                  </span>
                </button>

                {/* Coupon 3 */}
                <button
                  type="button"
                  onClick={() => handleCopyCoupon('ELIASVIP')}
                  aria-label="Aplicar cupom ELIASVIP de 15% de desconto"
                  className="w-full text-left group cursor-pointer bg-neutral-900/80 hover:bg-neutral-900 border border-dashed border-red-500/40 hover:border-red-500 p-3 rounded-xl flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-red-400 text-sm">ELIASVIP</span>
                      <span className="text-[10px] bg-red-400/10 text-red-300 font-medium px-1.5 py-0.5 rounded">15% OFF</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">15% de desconto especial (&gt; R$40)</p>
                  </div>
                  <span className="text-xs text-red-400 font-semibold group-hover:underline shrink-0">
                    {copiedCoupon === 'ELIASVIP' ? '✓ Aplicado' : 'Aplicar'}
                  </span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
