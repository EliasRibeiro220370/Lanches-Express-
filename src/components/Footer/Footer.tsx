import React from 'react';
import { useStore } from '../../hooks/useStore';
import { MapPin, Phone, Clock, Instagram, Facebook, Laptop, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { store, setIsStoreSettingsOpen } = useStore();

  const [logoClicks, setLogoClicks] = React.useState(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
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

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-white pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
              <img
                src={store.logoUrl}
                alt={store.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-red-500/40 active:scale-95 transition-transform"
              />
              <span className="font-black text-lg text-white tracking-tight">
                {store.name}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {store.slogan}. O melhor cardápio digital para pedidos rápidos, práticos e saborosos.
            </p>
          </div>

          {/* Contact & Location Col */}
          <div className="space-y-2 text-xs text-neutral-300">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider mb-2">
              Atendimento
            </h4>
            <p className="flex items-center gap-2 text-neutral-400">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{store.openingHours}</span>
            </p>
            <p className="flex items-center gap-2 text-neutral-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{store.whatsappNumber}</span>
            </p>
            <p className="flex items-center gap-2 text-neutral-400">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span>{store.address}, {store.neighborhoodCity}</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider mb-2">
              Redes Sociais
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${store.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-pink-400 border border-neutral-800 transition-all"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`https://facebook.com/${store.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-blue-400 border border-neutral-800 transition-all"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Info Card - High Quality & Secure */}
          <div className="space-y-2 bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-1.5 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider">
                Segurança & Agilidade
              </h4>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Faça seu pedido diretamente pelo WhatsApp da lanchonete sem intermediários nem taxas abusivas.
            </p>
          </div>

        </div>

        {/* Bottom Copyright Bar - MUST strictly contain "Direitos reservados Elias Ribeiro" */}
        <div className="pt-8 border-t border-neutral-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} {store.name} • Direitos reservados <strong className="text-white font-bold">{store.copyrightOwner || 'Elias Ribeiro'}</strong></p>
          
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <span>Desenvolvido para alta performance</span>
            <Laptop className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>

      </div>
    </footer>
  );
};
