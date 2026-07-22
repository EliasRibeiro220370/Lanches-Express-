import React from 'react';
import { StoreProvider } from './contexts/StoreContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { CategoryMenu } from './components/CategoryMenu/CategoryMenu';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { CartButton } from './components/CartButton/CartButton';
import { CartDrawer } from './components/CartButton/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp/FloatingWhatsApp';
import { StoreSettingsModal } from './components/Admin/StoreSettingsModal';
import { OrderTrackerModal } from './components/Admin/OrderTrackerModal';
import { Footer } from './components/Footer/Footer';

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-500 selection:text-white flex flex-col">
          
          {/* Main Top Header */}
          <Header />

          {/* Main Body */}
          <main className="flex-1">
            <Hero />
            <CategoryMenu />
            <ProductGrid />
          </main>

          {/* Floating Action Buttons & Drawers */}
          <CartButton />
          <CartDrawer />
          <FloatingWhatsApp />

          {/* SaaS Management Modals */}
          <StoreSettingsModal />
          <OrderTrackerModal />

          {/* Footer with Copyright "Elias Ribeiro" */}
          <Footer />

        </div>
      </CartProvider>
    </StoreProvider>
  );
}
