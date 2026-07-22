import { CartItem, CustomerDetails, StoreConfig } from '../types';
import { cleanPhoneForWa, formatCurrency } from './formatters';

interface GenerateWhatsAppUrlParams {
  items: CartItem[];
  customer: CustomerDetails;
  store: StoreConfig;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderId: string;
}

export const generateWhatsAppOrderUrl = ({
  items,
  customer,
  store,
  subtotal,
  deliveryFee,
  discount,
  total,
  orderId
}: GenerateWhatsAppUrlParams): string => {
  const isDelivery = customer.deliveryType === 'delivery';

  let message = `*🍔 NOVO PEDIDO #${orderId}*\n`;
  message += `*${store.name}*\n`;
  message += `------------------------------------\n\n`;

  message += `*📋 ITENS DO PEDIDO:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.quantity}x ${item.product.name}* - ${formatCurrency(item.totalPrice)}\n`;

    if (item.selectedDoneness) {
      message += `   • Ponto: ${item.selectedDoneness}\n`;
    }
    if (item.selectedBread) {
      message += `   • Pão: ${item.selectedBread}\n`;
    }
    if (item.selectedCustomizations && item.selectedCustomizations.length > 0) {
      item.selectedCustomizations.forEach(c => {
        message += `   • Adicional: ${c.optionName} (${c.price > 0 ? formatCurrency(c.price) : 'Grátis'})\n`;
      });
    }
    if (item.observation) {
      message += `   • Obs: _"${item.observation}"_\n`;
    }
    message += `\n`;
  });

  message += `------------------------------------\n`;
  message += `*💰 RESUMO DO PEDIDO:*\n`;
  message += `Subtotal: ${formatCurrency(subtotal)}\n`;
  if (isDelivery) {
    message += `Taxa de Entrega: ${deliveryFee > 0 ? formatCurrency(deliveryFee) : 'GRÁTIS'}\n`;
  } else {
    message += `Tipo: Retirada no Balcão (R$ 0,00)\n`;
  }
  if (discount > 0) {
    message += `Desconto: -${formatCurrency(discount)}\n`;
  }
  message += `*TOTAL: ${formatCurrency(total)}*\n\n`;

  message += `------------------------------------\n`;
  message += `*👤 DADOS DO CLIENTE:*\n`;
  message += `*Nome:* ${customer.name}\n`;
  message += `*Telefone:* ${customer.phone}\n`;

  if (isDelivery) {
    message += `\n*📍 ENDEREÇO DE ENTREGA:*\n`;
    message += `${customer.address}, Nº ${customer.number}\n`;
    message += `Bairro: ${customer.neighborhood}\n`;
    if (customer.complement) {
      message += `Complemento: ${customer.complement}\n`;
    }
  } else {
    message += `\n*📍 TIPO DE RETIRADA:* Retirada no Estabelecimento\n`;
  }

  message += `\n*💳 FORMA DE PAGAMENTO:*\n`;
  if (customer.paymentMethod === 'pix') {
    message += `• PIX (Aguardando chave/QR Code)\n`;
  } else if (customer.paymentMethod === 'card_delivery') {
    message += `• Cartão na Entrega (Maquininha)\n`;
  } else if (customer.paymentMethod === 'cash') {
    message += `• Dinheiro`;
    if (customer.cashChangeFor && customer.cashChangeFor > total) {
      const troco = customer.cashChangeFor - total;
      message += ` (Troco para ${formatCurrency(customer.cashChangeFor)} -> Troco: ${formatCurrency(troco)})`;
    }
    message += `\n`;
  }

  if (customer.observation) {
    message += `\n*📝 Obs. Geral:* ${customer.observation}\n`;
  }

  message += `\n_Pedido gerado via ${store.name}_`;

  const phoneDigits = cleanPhoneForWa(store.whatsappNumber);
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${phoneDigits}?text=${encodedText}`;
};
