export type CategoryId = 'todos' | 'combos' | 'hamburgueres' | 'porcoes' | 'bebidas' | 'sobremesas' | 'molhos';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string; // Lucide icon name or emoji
  description?: string;
  badge?: string;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export interface CustomizationOption {
  id: string;
  title: string;
  type: 'single' | 'multiple';
  required?: boolean;
  min?: number;
  max?: number;
  options: {
    id: string;
    name: string;
    price: number;
    description?: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: CategoryId;
  image: string;
  badge?: 'Mais Pedido' | 'Novo' | 'Promoção' | 'Especial';
  rating: number;
  prepTimeMinutes: number;
  isAvailable: boolean;
  ingredients?: string[];
  customizations?: CustomizationOption[];
}

export interface SelectedCustomization {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedDoneness?: string; // Ponto da carne
  selectedBread?: string;   // Tipo de pão
  selectedCustomizations: SelectedCustomization[];
  observation?: string;
  unitPrice: number; // base price + selected extras
  totalPrice: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  description: string;
}

export type PaymentMethod = 'pix' | 'card_delivery' | 'cash';
export type DeliveryType = 'delivery' | 'pickup';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  number: string;
  neighborhood: string;
  complement?: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  cashChangeFor?: number;
  observation?: string;
}

export interface StoreConfig {
  id: string;
  name: string;
  slogan: string;
  logoUrl: string;
  bannerUrl: string;
  primaryColor: string;
  whatsappNumber: string; // formatted e.g. 5511999999999
  address: string;
  neighborhoodCity: string;
  openingHours: string;
  isOpen: boolean;
  deliveryFee: number;
  minOrderValue: number;
  freeDeliveryThreshold: number;
  instagram: string;
  facebook: string;
  copyrightOwner: string; // "Elias Ribeiro"
}

export type OrderStatus = 'received' | 'preparing' | 'delivery' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  estimatedTime: string;
}
