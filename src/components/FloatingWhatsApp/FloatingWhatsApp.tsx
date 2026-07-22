import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { cleanPhoneForWa } from '../../utils/formatters';

export const FloatingWhatsApp: React.FC = () => {
  const { store } = useStore();

  const phoneDigits = cleanPhoneForWa(store.whatsappNumber);
  const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Olá! Gostaria de tirar dúvidas sobre o cardápio da ${store.name}.`)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-2.5 left-6 md:left-1/2 md:-translate-x-1/2 z-40 group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-950/60 ring-2 ring-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
      title="Atendimento via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-neutral-950 stroke-emerald-500 group-hover:rotate-12 transition-transform" />
      <span className="hidden md:inline text-xs font-bold tracking-tight">
        Atendimento WhatsApp
      </span>
    </a>
  );
};
