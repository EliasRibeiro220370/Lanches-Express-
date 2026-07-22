import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, StoreConfig, Order, CategoryId } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface StoreContextType {
  store: StoreConfig;
  updateStoreConfig: (newConfig: Partial<StoreConfig>) => void;
  products: Product[];
  activeCategory: CategoryId;
  setActiveCategory: (category: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  isStoreSettingsOpen: boolean;
  setIsStoreSettingsOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  activeOrderToTrack: Order | null;
  setActiveOrderToTrack: (order: Order | null) => void;
}

const DEFAULT_STORE: StoreConfig = {
  id: 'lanches-express-demo',
  name: 'Lanches Express',
  slogan: 'Hambúrgueres Artesanais & Lanches Suculentos',
  logoUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=200',
  bannerUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1200',
  primaryColor: '#ef4444', // Red-500
  whatsappNumber: '5511999998888',
  address: 'Av. Paulista, 1000 - Bela Vista',
  neighborhoodCity: 'São Paulo - SP',
  openingHours: 'Qua a Dom: 18h às 23h30',
  isOpen: true,
  deliveryFee: 7.00,
  minOrderValue: 20.00,
  freeDeliveryThreshold: 60.00,
  instagram: '@lanchesexpress.demo',
  facebook: 'lanchesexpress.oficial',
  copyrightOwner: 'Elias Ribeiro'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('lanches_express_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.openingHours && parsed.openingHours.includes('Seg a Dom')) {
          parsed.openingHours = parsed.openingHours.replace('Seg a Dom', 'Qua a Dom');
        }
        return parsed;
      } catch {
        return DEFAULT_STORE;
      }
    }
    return DEFAULT_STORE;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lanches_express_products');
    const prods: Product[] = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    return prods.map(p => {
      let updatedProduct = { ...p };
      
      // Sync fresh image, category, name, and description from initial data if modified
      const initialMatch = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
      if (initialMatch) {
        updatedProduct.categoryId = initialMatch.categoryId;
        if (p.image.includes('1594212699903') || p.image.includes('1624371414361') || p.image.includes('1616423642738') || p.id === 'molho-bbq-artesanal') {
          updatedProduct.image = initialMatch.image;
        }
        if (p.id === 'churros-doce-de-leite' || p.id === 'molho-maionese-verde' || p.id === 'molho-bbq-artesanal') {
          updatedProduct.name = initialMatch.name;
          updatedProduct.description = initialMatch.description;
        }
      }

      if (updatedProduct.badge && ['mais pedido', 'novo', 'especial', 'promoção', 'promocao', 'economize'].some(b => updatedProduct.badge?.toLowerCase().includes(b))) {
        delete updatedProduct.badge;
      }
      return updatedProduct;
    });
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('lanches_express_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lanches_express_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isStoreSettingsOpen, setIsStoreSettingsOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [activeOrderToTrack, setActiveOrderToTrack] = useState<Order | null>(null);

  useEffect(() => {
    localStorage.setItem('lanches_express_store', JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    localStorage.setItem('lanches_express_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lanches_express_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('lanches_express_orders', JSON.stringify(orders));
  }, [orders]);

  const updateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    setStore(prev => ({ ...prev, ...newConfig }));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setActiveOrderToTrack(order);
    setIsOrderTrackerOpen(true);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (activeOrderToTrack && activeOrderToTrack.id === orderId) {
      setActiveOrderToTrack(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <StoreContext.Provider value={{
      store,
      updateStoreConfig,
      products,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      favorites,
      toggleFavorite,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      addOrder,
      updateOrderStatus,
      isStoreSettingsOpen,
      setIsStoreSettingsOpen,
      isOrderTrackerOpen,
      setIsOrderTrackerOpen,
      activeOrderToTrack,
      setActiveOrderToTrack
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
