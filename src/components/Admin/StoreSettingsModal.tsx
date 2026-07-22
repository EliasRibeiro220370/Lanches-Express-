import React, { useState } from 'react';
import {
  X,
  Settings,
  Plus,
  Trash2,
  Save,
  Store,
  Package,
  DollarSign,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Search,
  Edit2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  RefreshCw,
  Layers,
  Instagram,
  Facebook,
  Lock,
  Upload
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { CategoryId, Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const PRESET_IMAGES = [
  { label: 'Hambúrguer', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' },
  { label: 'Smash', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800' },
  { label: 'Batata', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800' },
  { label: 'Refrigerante', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800' },
  { label: 'Milkshake', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800' },
  { label: 'Sobremesa', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800' }
];

export const StoreSettingsModal: React.FC = () => {
  const {
    store,
    updateStoreConfig,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    isStoreSettingsOpen,
    setIsStoreSettingsOpen
  } = useStore();

  const [activeTab, setActiveTab] = useState<'store' | 'products'>('store');

  // Form state for store config
  const [storeForm, setStoreForm] = useState(store);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Search & Filter state for products management
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todos');

  // Inline product edit state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductForm, setEditingProductForm] = useState<Partial<Product>>({});

  // Product delete confirmation modal state
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Helper for reading image file uploads to Data URL (base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // New product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState<{
    name: string;
    description: string;
    price: string | number;
    categoryId: CategoryId;
    image: string;
    badge?: Product['badge'];
    prepTimeMinutes: number;
    rating: number;
    isAvailable: boolean;
  }>({
    name: '',
    description: '',
    price: '',
    categoryId: 'hamburgueres',
    image: PRESET_IMAGES[0].url,
    badge: undefined,
    prepTimeMinutes: 20,
    rating: 5.0,
    isAvailable: true
  });
  const [addProductSuccess, setAddProductSuccess] = useState(false);

  if (!isStoreSettingsOpen) return null;

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig(storeForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(String(newProd.price).replace(',', '.'));
    if (!newProd.name.trim() || isNaN(parsedPrice) || parsedPrice <= 0) return;
    
    addProduct({
      ...newProd,
      price: parsedPrice
    });

    setAddProductSuccess(true);
    setTimeout(() => setAddProductSuccess(false), 3000);

    setNewProd({
      name: '',
      description: '',
      price: '',
      categoryId: 'hamburgueres',
      image: PRESET_IMAGES[0].url,
      badge: undefined,
      prepTimeMinutes: 20,
      rating: 5.0,
      isAvailable: true
    });
    setShowAddForm(false);
  };

  const startEditingProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditingProductForm({
      name: p.name,
      price: String(p.price),
      description: p.description,
      categoryId: p.categoryId,
      image: p.image,
      badge: p.badge,
      isAvailable: p.isAvailable
    });
  };

  const cancelEditingProduct = () => {
    setEditingProductId(null);
    setEditingProductForm({});
  };

  const saveEditingProduct = (id: string) => {
    const parsedPrice = parseFloat(String(editingProductForm.price).replace(',', '.'));
    if (!editingProductForm.name?.trim() || isNaN(parsedPrice) || parsedPrice <= 0) return;
    
    updateProduct(id, {
      ...editingProductForm,
      price: parsedPrice
    });
    setEditingProductId(null);
    setEditingProductForm({});
  };

  const confirmDeleteProduct = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryFilter === 'todos' || p.categoryId === selectedCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const productToDelete = products.find(p => p.id === deletingProductId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-white my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-white tracking-tight">
                Painel Administrativo
              </h2>
              <p className="text-xs text-neutral-400">
                Gerencie dados do estabelecimento, altere preços e cadastre ou exclua produtos
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsStoreSettingsOpen(false)}
            className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'store'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Informações da Lanchonete</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Cardápio, Produtos & Preços ({products.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs space-y-6">
          {activeTab === 'store' ? (
            <form onSubmit={handleSaveStore} className="space-y-6">
              
              {/* Section 1: Informações Principais */}
              <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 space-y-4">
                <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <Store className="w-4 h-4" /> Nome & Informações do Estabelecimento
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      Título / Nome do Estabelecimento
                    </label>
                    <input
                      type="text"
                      required
                      value={storeForm.name}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: Lanches Express"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      Slogan / Descrição Curta
                    </label>
                    <input
                      type="text"
                      value={storeForm.slogan}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, slogan: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: Hambúrgueres Artesanais & Lanches Suculentos"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Telefone / WhatsApp (com DDD)
                    </label>
                    <input
                      type="text"
                      required
                      value={storeForm.whatsappNumber}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: 5511999998888"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Horário de Funcionamento
                    </label>
                    <input
                      type="text"
                      value={storeForm.openingHours}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, openingHours: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: Qua a Dom: 18h às 23h30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      Endereço Completo
                    </label>
                    <input
                      type="text"
                      value={storeForm.address}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: Av. Paulista, 1000 - Bela Vista"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      Bairro / Cidade - UF
                    </label>
                    <input
                      type="text"
                      value={storeForm.neighborhoodCity}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, neighborhoodCity: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: São Paulo - SP"
                    />
                  </div>
                </div>
              </div>

              {/* Status Aberto / Fechado */}
              <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white text-sm">Status Atual da Lanchonete</p>
                  <p className="text-neutral-400 text-xs">Define se o estabelecimento está aceitando pedidos online no momento</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreForm(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md ${
                    storeForm.isOpen
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                  }`}
                >
                  {storeForm.isOpen ? '🟢 Aberto para Pedidos' : '🔴 Fechado no Momento'}
                </button>
              </div>

              {/* Section 2: Taxas & Pedido Mínimo */}
              <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 space-y-4">
                <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <DollarSign className="w-4 h-4" /> Taxas & Pedidos
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">Taxa de Entrega (R$)</label>
                    <input
                      type="number"
                      step="0.50"
                      value={storeForm.deliveryFee || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, deliveryFee: e.target.value ? Number(e.target.value) : 0 }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">Pedido Mínimo (R$)</label>
                    <input
                      type="number"
                      step="1.00"
                      value={storeForm.minOrderValue || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, minOrderValue: e.target.value ? Number(e.target.value) : 0 }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">Frete Grátis A Partir De (R$)</label>
                    <input
                      type="number"
                      step="1.00"
                      value={storeForm.freeDeliveryThreshold || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, freeDeliveryThreshold: e.target.value ? Number(e.target.value) : 0 }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Redes Sociais, Logos & Copyright */}
              <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 space-y-4">
                <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <ImageIcon className="w-4 h-4" /> Visual, Redes Sociais & Direitos Reservados
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      URL do Logo / ou UPLOAD do Logo
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="https://... ou faça upload ao lado"
                        value={storeForm.logoUrl}
                        onChange={(e) => setStoreForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                      <label className="cursor-pointer px-3 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileChange(e, (url) => setStoreForm(prev => ({ ...prev, logoUrl: url })))}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      URL do Banner do Topo / ou UPLOAD do Banner
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="https://... ou faça upload ao lado"
                        value={storeForm.bannerUrl}
                        onChange={(e) => setStoreForm(prev => ({ ...prev, bannerUrl: e.target.value }))}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                      <label className="cursor-pointer px-3 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileChange(e, (url) => setStoreForm(prev => ({ ...prev, bannerUrl: url })))}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1 flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram (@)
                    </label>
                    <input
                      type="text"
                      value={storeForm.instagram}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: @lanchesexpress"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1 flex items-center gap-1">
                      <Facebook className="w-3.5 h-3.5 text-blue-400" /> Facebook
                    </label>
                    <input
                      type="text"
                      value={storeForm.facebook}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Ex: lanchesexpress.oficial"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Titular dos Direitos Reservados
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        readOnly
                        value={storeForm.copyrightOwner || 'Elias Ribeiro'}
                        className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl p-2.5 text-amber-300 font-extrabold opacity-90 cursor-not-allowed pr-10"
                      />
                      <Lock className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[10px] text-amber-400/90 mt-1 font-medium">
                      🔒 Protegido: Alterável exclusivamente pelo titular no código_fonte.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button & Success Alert */}
              <div className="flex items-center justify-between pt-2">
                {saveSuccess && (
                  <span className="text-emerald-400 font-bold flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Informações salvas com sucesso!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-extrabold rounded-xl shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-all flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados do Estabelecimento</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-6">

              {/* Header Actions for Products Management */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Gerenciamento de Cardápio</h3>
                  <p className="text-neutral-400 text-xs">Insira novos produtos, modifique preços e descrições ou exclua itens</p>
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-xs ${
                    showAddForm
                      ? 'bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-md hover:scale-105'
                  }`}
                >
                  {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showAddForm ? 'Fechar Formulário' : 'Novo Produto'}</span>
                </button>
              </div>

              {/* Form to Add New Product */}
              {showAddForm && (
                <form onSubmit={handleAddProductSubmit} className="bg-neutral-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <p className="font-extrabold text-amber-400 text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Cadastrar Novo Produto
                    </p>
                    <span className="text-[10px] text-neutral-400">Preencha os campos e clique em cadastrar</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-neutral-300 font-semibold block mb-1">Nome do Produto</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: X-Bacon Duplo com Cheddar"
                        value={newProd.name}
                        onChange={(e) => setNewProd(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-300 font-semibold block mb-1">Categoria</label>
                      <select
                        value={newProd.categoryId}
                        onChange={(e) => setNewProd(prev => ({ ...prev, categoryId: e.target.value as CategoryId }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-medium"
                      >
                        <option value="combos">Combos Especiais</option>
                        <option value="hamburgueres">Hambúrgueres Artesanais</option>
                        <option value="porcoes">Porções & Acompanhamentos</option>
                        <option value="bebidas">Bebidas & Sucos</option>
                        <option value="sobremesas">Sobremesas</option>
                        <option value="molhos">Molhos Especiais</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-neutral-300 font-semibold block mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.50"
                        required
                        placeholder="Ex: 28.90"
                        value={newProd.price}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setNewProd(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white font-bold text-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-300 font-semibold block mb-1">Destaque (Badge)</label>
                      <select
                        value={newProd.badge || ''}
                        onChange={(e) => setNewProd(prev => ({ ...prev, badge: (e.target.value || undefined) as Product['badge'] }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                      >
                        <option value="">Nenhum Destaque</option>
                        <option value="Mais Pedido">Mais Pedido</option>
                        <option value="Novo">Novo</option>
                        <option value="Promoção">Promoção</option>
                        <option value="Especial">Especial</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-neutral-300 font-semibold block mb-1">Tempo de Preparo (Minutos)</label>
                      <input
                        type="number"
                        value={newProd.prepTimeMinutes}
                        onChange={(e) => setNewProd(prev => ({ ...prev, prepTimeMinutes: Number(e.target.value) }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">Descrição dos Ingredientes</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Pão brioche, 2x hambúrguer de 150g, muito bacon crocante e cheddar fatiado."
                      value={newProd.description}
                      onChange={(e) => setNewProd(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      URL da Imagem / ou UPLOAD da Imagem
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <input
                        type="text"
                        placeholder="https://... ou faça upload da foto ao lado"
                        value={newProd.image}
                        onChange={(e) => setNewProd(prev => ({ ...prev, image: e.target.value }))}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white text-xs w-full"
                      />
                      <label className="cursor-pointer px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-500/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-sm">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>UPLOAD da Imagem</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileChange(e, (url) => setNewProd(prev => ({ ...prev, image: url })))}
                        />
                      </label>
                    </div>

                    {/* Quick Image Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] text-neutral-400">Fotos de exemplo:</span>
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setNewProd(prev => ({ ...prev, image: preset.url }))}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] border border-neutral-700"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-xl shadow-lg transition-all"
                    >
                      + Cadastrar Produto
                    </button>
                  </div>
                </form>
              )}

              {addProductSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Produto cadastrado com sucesso e adicionado ao cardápio!
                </div>
              )}

              {/* Search & Filter Bar for Existing Products */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou ingrediente para alterar preço..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="todos">Todas as Categorias ({products.length})</option>
                    <option value="combos">Combos Especiais</option>
                    <option value="hamburgueres">Hambúrgueres Artesanais</option>
                    <option value="porcoes">Porções & Acompanhamentos</option>
                    <option value="bebidas">Bebidas & Sucos</option>
                    <option value="sobremesas">Sobremesas</option>
                    <option value="molhos">Molhos Especiais</option>
                  </select>
                </div>
              </div>

              {/* Products List Table / Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span>Exibindo {filteredProducts.length} de {products.length} produtos</span>
                  <span className="text-[11px] italic">Clique em "Editar" para alterar preços ou nomes</span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {filteredProducts.map((p) => {
                    const isEditing = editingProductId === p.id;

                    if (isEditing) {
                      return (
                        <div
                          key={p.id}
                          className="bg-neutral-950 p-4 rounded-2xl border-2 border-amber-500/60 space-y-3 animate-fade-in"
                        >
                          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                            <span className="font-bold text-amber-400 text-xs">Editando: {p.name}</span>
                            <span className="text-[10px] text-neutral-400">ID: {p.id}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="text-neutral-400 text-[11px] block mb-1 font-semibold">Nome do Produto</label>
                              <input
                                type="text"
                                value={editingProductForm.name || ''}
                                onChange={(e) => setEditingProductForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 text-white font-bold"
                              />
                            </div>

                            <div>
                              <label className="text-neutral-400 text-[11px] block mb-1 font-semibold">Preço (R$)</label>
                              <input
                                type="number"
                                step="0.50"
                                placeholder="Ex: 28.90"
                                value={editingProductForm.price ?? ''}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setEditingProductForm(prev => ({ ...prev, price: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 text-amber-400 font-extrabold text-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-neutral-400 text-[11px] block mb-1 font-semibold">Categoria</label>
                              <select
                                value={editingProductForm.categoryId || 'hamburgueres'}
                                onChange={(e) => setEditingProductForm(prev => ({ ...prev, categoryId: e.target.value as CategoryId }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 text-white"
                              >
                                <option value="combos">Combos Especiais</option>
                                <option value="hamburgueres">Hambúrgueres Artesanais</option>
                                <option value="porcoes">Porções & Acompanhamentos</option>
                                <option value="bebidas">Bebidas & Sucos</option>
                                <option value="sobremesas">Sobremesas</option>
                                <option value="molhos">Molhos Especiais</option>
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="text-neutral-400 text-[11px] block mb-1 font-semibold">
                                URL da Imagem / ou UPLOAD da Imagem
                              </label>
                              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                                <input
                                  type="text"
                                  placeholder="https://... ou faça upload da foto ao lado"
                                  value={editingProductForm.image || ''}
                                  onChange={(e) => setEditingProductForm(prev => ({ ...prev, image: e.target.value }))}
                                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl p-2 text-white text-xs w-full"
                                />
                                <label className="cursor-pointer px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-500/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm">
                                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                                  <span>UPLOAD da Imagem</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageFileChange(e, (url) => setEditingProductForm(prev => ({ ...prev, image: url })))}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-neutral-400 text-[11px] block mb-1 font-semibold">Descrição</label>
                            <textarea
                              rows={2}
                              value={editingProductForm.description || ''}
                              onChange={(e) => setEditingProductForm(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 text-white text-xs"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={cancelEditingProduct}
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEditingProduct(p.id)}
                              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" /> Salvar Alterações
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={p.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          p.isAvailable
                            ? 'bg-neutral-800/80 border-neutral-700/80 hover:border-neutral-600'
                            : 'bg-neutral-900/60 border-neutral-800 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-neutral-700"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-white text-sm truncate">{p.name}</p>
                              {p.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-400 text-neutral-950 uppercase">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-400 text-xs line-clamp-1">{p.description}</p>
                            <span className="inline-block font-extrabold text-amber-400 text-xs mt-0.5">
                              {formatCurrency(p.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {/* Toggle availability */}
                          <button
                            type="button"
                            onClick={() => updateProduct(p.id, { isAvailable: !p.isAvailable })}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                              p.isAvailable
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            }`}
                            title={p.isAvailable ? 'Clique para pausar item' : 'Clique para ativar item'}
                          >
                            {p.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{p.isAvailable ? 'Disponível' : 'Pausado'}</span>
                          </button>

                          {/* Quick Edit button */}
                          <button
                            type="button"
                            onClick={() => startEditingProduct(p)}
                            className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition-colors"
                            title="Editar Preço e Detalhes"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Editar</span>
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                            title="Excluir Produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-neutral-400 space-y-2">
                      <p className="font-semibold text-sm">Nenhum produto encontrado.</p>
                      <p className="text-xs">Tente mudar o filtro de busca ou cadastrar um novo produto.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {deletingProductId && productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Excluir Produto?</h4>
                  <p className="text-xs text-neutral-400">Esta ação não poderá ser desfeita.</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                <img src={productToDelete.image} alt={productToDelete.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-white text-xs">{productToDelete.name}</p>
                  <p className="text-amber-400 font-extrabold text-xs">{formatCurrency(productToDelete.price)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProductId(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sim, Excluir</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
