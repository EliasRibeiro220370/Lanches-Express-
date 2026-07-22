import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // COMBOS
  {
    id: 'combo-express-master',
    name: 'Combo Smash Supreme',
    description: '2 Hambúrgueres Smash (90g cada), duplo queijo cheddar derretido, bacon artesanal, maionese verde no pão brioche. Acompanha Batata Rústica M + Coca-Cola 350ml.',
    price: 39.90,
    originalPrice: 47.90,
    categoryId: 'combos',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    prepTimeMinutes: 25,
    isAvailable: true,
    ingredients: ['2x Blend 90g', 'Cheddar Duplo', 'Bacon Crocante', 'Maionese da Casa', 'Pão Brioche', 'Batata Rústica', 'Coca-Cola 350ml'],
    customizations: [
      {
        id: 'bread',
        title: 'Escolha o Pão',
        type: 'single',
        required: true,
        options: [
          { id: 'brioche', name: 'Pão Brioche Tostado na Manteiga', price: 0 },
          { id: 'australiano', name: 'Pão Australiano', price: 2.00 },
          { id: 'gergelim', name: 'Pão com Gergelim', price: 0 }
        ]
      },
      {
        id: 'beverage',
        title: 'Escolha a Bebida',
        type: 'single',
        required: true,
        options: [
          { id: 'coca', name: 'Coca-Cola 350ml Gelada', price: 0 },
          { id: 'coca-zero', name: 'Coca-Cola Zero 350ml', price: 0 },
          { id: 'guarana', name: 'Guaraná Antarctica 350ml', price: 0 },
          { id: 'suco-laranja', name: 'Suco Natural de Laranja 400ml', price: 3.50 }
        ]
      },
      {
        id: 'extras',
        title: 'Adicionais Especiais',
        type: 'multiple',
        options: [
          { id: 'extra-bacon', name: 'Bacon Duplo Crocante', price: 4.50 },
          { id: 'extra-cheese', name: 'Queijo Cheddar Extra', price: 4.00 },
          { id: 'extra-sauce', name: 'Molho Verde Extra (pote 50g)', price: 3.00 }
        ]
      }
    ]
  },
  {
    id: 'combo-monster-bbq',
    name: 'Combo Monster Barbecue',
    description: 'Hambúrguer de 180g selado na grelha, queijo colby jack, onion rings crocantes, bacon em fatias e molho BBQ defumado. Acompanha Batata Crinkle G + Bebida.',
    price: 44.90,
    originalPrice: 52.00,
    categoryId: 'combos',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    prepTimeMinutes: 30,
    isAvailable: true,
    ingredients: ['Blend 180g Angus', 'Onion Rings', 'Bacon Defumado', 'Molho BBQ', 'Batata Crinkle G'],
    customizations: [
      {
        id: 'doneness',
        title: 'Ponto da Carne',
        type: 'single',
        required: true,
        options: [
          { id: 'ponto', name: 'Ao Ponto (Rosada por dentro)', price: 0 },
          { id: 'bem-passado', name: 'Bem Passado', price: 0 },
          { id: 'mal-passado', name: 'Mal Passado (Carne bem suculenta)', price: 0 }
        ]
      }
    ]
  },

  // HAMBURGUERES ARTESANAIS
  {
    id: 'burger-classic-cheddar',
    name: 'Classic Bacon Cheddar',
    description: 'Blend suculento de 180g Angus, creme de cheddar inglês, bastante bacon em fatias crocantes e maionese especial de alho assado.',
    price: 29.90,
    categoryId: 'hamburgueres',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    prepTimeMinutes: 20,
    isAvailable: true,
    ingredients: ['Blend Angus 180g', 'Cheddar Inglês', 'Bacon Crocante', 'Maionese de Alho', 'Pão Brioche'],
    customizations: [
      {
        id: 'doneness',
        title: 'Ponto da Carne',
        type: 'single',
        required: true,
        options: [
          { id: 'ponto', name: 'Ao Ponto', price: 0 },
          { id: 'bem-passado', name: 'Bem Passado', price: 0 },
          { id: 'mal-passado', name: 'Mal Passado', price: 0 }
        ]
      },
      {
        id: 'bread',
        title: 'Pão do Lanche',
        type: 'single',
        required: true,
        options: [
          { id: 'brioche', name: 'Pão Brioche Tradicional', price: 0 },
          { id: 'australiano', name: 'Pão Australiano', price: 2.50 }
        ]
      },
      {
        id: 'extras',
        title: 'Turbine seu Lanche',
        type: 'multiple',
        options: [
          { id: 'extra-carne', name: 'Hambúrguer Adicional 180g', price: 9.90 },
          { id: 'extra-ovo', name: 'Ovo Frito na Manteiga', price: 2.50 },
          { id: 'extra-picles', name: 'Picles Artesanal de Pepino', price: 3.00 },
          { id: 'extra-cebola-out', name: 'Cebola Caramelizada', price: 3.50 }
        ]
      }
    ]
  },
  {
    id: 'burger-double-smash',
    name: 'Double Smash Special',
    description: '2x discos smash de 90g crostados no ponto certo, queijo americano derretido, picles, cebola roxa picadinha e molho especial secreto.',
    price: 27.90,
    categoryId: 'hamburgueres',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    prepTimeMinutes: 15,
    isAvailable: true,
    ingredients: ['2x Smash 90g', 'Queijo Americano', 'Picles', 'Cebola Roxa', 'Molho da Casa'],
    customizations: [
      {
        id: 'extras',
        title: 'Ingredientes Adicionais',
        type: 'multiple',
        options: [
          { id: 'extra-bacon', name: 'Bacon em Cubos', price: 3.90 },
          { id: 'extra-cheddar', name: 'Cheddar Cremoso Extra', price: 3.50 }
        ]
      }
    ]
  },
  {
    id: 'burger-gorgonzola-geleiadebacon',
    name: 'Gorgonzola & Geleia de Bacon',
    description: 'Hambúrguer de 180g, creme de gorgonzola premium, geleia de bacon artesanal com toque adocicado, rúcula fresca no pão brioche.',
    price: 34.90,
    categoryId: 'hamburgueres',
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    prepTimeMinutes: 22,
    isAvailable: true,
    ingredients: ['Blend 180g', 'Creme de Gorgonzola', 'Geleia de Bacon', 'Rúcula Fresca', 'Pão Brioche']
  },
  {
    id: 'burger-veggie-green',
    name: 'Green Veggie Burger',
    description: 'Hambúrguer artesanal de grão de bico com cogumelos, queijo muçarela derretido, tomate confit, alface americana e maionese verde vegana.',
    price: 28.90,
    categoryId: 'hamburgueres',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    prepTimeMinutes: 20,
    isAvailable: true,
    ingredients: ['Hambúrguer de Grão de Bico e Cogumelos', 'Muçarela', 'Tomate Confit', 'Maionese Verde']
  },

  // PORCOES
  {
    id: 'batata-rustica-cheddar-bacon',
    name: 'Batata Rústica Supreme',
    description: 'Batatas rústicas artesanais com casca, fritas na hora, cobertas com cheddar cremoso e bastante bacon crocante picado. (Aproximadamente 400g).',
    price: 26.90,
    categoryId: 'porcoes',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    prepTimeMinutes: 15,
    isAvailable: true,
    ingredients: ['Batatas Rústicas', 'Cheddar Cremoso', 'Bacon Crocante', 'Salsinha Fresca']
  },
  {
    id: 'onion-rings-crocantes',
    name: 'Onion Rings Crocantes (12 un)',
    description: 'Anéis de cebola empanados e super crocantes. Acompanha pote de molho Barbecue defumado artesanal.',
    price: 21.90,
    categoryId: 'porcoes',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    prepTimeMinutes: 12,
    isAvailable: true
  },
  {
    id: 'nuggets-crocantes',
    name: 'Coxinha de Frango sem Massa (8 un)',
    description: 'Coxinhas de frango desfiado com catupiry puro, super recheadas e empanadas em farinha panko crocante.',
    price: 24.90,
    categoryId: 'porcoes',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    prepTimeMinutes: 15,
    isAvailable: true
  },

  // BEBIDAS
  {
    id: 'coca-lata-350',
    name: 'Coca-Cola Original 350ml',
    description: 'Lata 350ml gelada trincando.',
    price: 6.50,
    categoryId: 'bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    prepTimeMinutes: 2,
    isAvailable: true
  },
  {
    id: 'guarana-350',
    name: 'Guaraná Antarctica 350ml',
    description: 'Lata 350ml gelada.',
    price: 6.00,
    categoryId: 'bebidas',
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    prepTimeMinutes: 2,
    isAvailable: true
  },
  {
    id: 'milkshake-nutella',
    name: 'Milkshake de Nutella & Overtop (400ml)',
    description: 'Sorvete cremoso de baunilha batido com Nutella de verdade, chantilly e raspas de chocolate meio amargo.',
    price: 19.90,
    categoryId: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    prepTimeMinutes: 10,
    isAvailable: true
  },

  // SOBREMESAS
  {
    id: 'brownie-com-sorvete',
    name: 'Brownie de Chocolate com Sorvete',
    description: 'Brownie quentinho com pedaços de nozes, acompanhado de uma bola de sorvete de baunilha e calda de fudge de chocolate.',
    price: 18.90,
    categoryId: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    prepTimeMinutes: 8,
    isAvailable: true
  },
  {
    id: 'churros-doce-de-leite',
    name: 'Sobremessa',
    description: 'Doces deliciosos.',
    price: 16.90,
    categoryId: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    prepTimeMinutes: 10,
    isAvailable: true
  },

  // MOLHOS ESPECIAIS
  {
    id: 'molho-maionese-verde',
    name: 'Batata Com Maionese Verde de Ervas Finas (50g)',
    description: 'Nossa famosa maionese caseira temperada com cheiro verde, alho suave e azeite de oliva.',
    price: 4.00,
    categoryId: 'molhos',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    prepTimeMinutes: 2,
    isAvailable: true
  },
  {
    id: 'molho-bbq-artesanal',
    name: 'Costela Suina Defumada ao Molho Barbecue (50)',
    description: 'Molho BBQ artesanal levemente picante com sabor defumado em lenha frutífera.',
    price: 4.00,
    categoryId: 'molhos',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    prepTimeMinutes: 2,
    isAvailable: true
  }
];

export const VALID_COUPONS = [
  {
    code: 'LANCHE10',
    discountType: 'percentage' as const,
    value: 10,
    description: '10% de desconto no valor dos produtos'
  },
  {
    code: 'FRETEGRATIS',
    discountType: 'fixed' as const,
    value: 7.00,
    description: 'Desconto equivalente ao valor do frete'
  },
  {
    code: 'ELIASVIP',
    discountType: 'percentage' as const,
    value: 15,
    minOrderValue: 40,
    description: '15% OFF em compras acima de R$ 40'
  }
];
