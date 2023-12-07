export function createOrders() {
  const ordersStore = useOrdersStore();
  const { orders, productsOrders, user } = ordersStore;
  return api().post("/orders", {
    ...orders,
    user_id: user.user_id,
    products_orders: productsOrders,
  });
}

export async function sendWhatsapp() {
  const ordersStore = useOrdersStore();
  const { orders, productsOrders, user } = ordersStore;
  let message = `Meu nome é ${orders.name} , contato ${orders.phone}

  ${productsOrders.map(
    (product) => `${product.productName}
  (${convertToMoneyString(product.price)})
  Adicionais:
  ${product.additional.map(
    (add) => `${add.name} - ${convertToMoneyString(add.value)}\n`
  )}
  Subtotal: ${convertToMoneyString(product.subtotal)}
  *________________________________*

  `
  )}
  Subtotal:                  ${convertToMoneyString(orders.total)}
  Entrega:                   R$ 10,00
  Total:                        R$ ${orders.total}
  
  Pagamento em: ${
    orders.payment_type === "money"
      ? `Dinheiro - Troca para R$ ${orders.change}`
      : `Cartão`
  }
  ${orders.isDelivery ? "Entrega: Sim" : "Entrega: Não"}
  ${
    orders.isDelivery &&
    `Endereço da Entrega:
    
    Rua: ${orders.address}
    Número: ${orders.address_number}
    Bairro: ${orders.neighborhood}
    Cidade: ${orders.city}`
  }
  `;

  message = encodeURI(message);

  await navigateTo(
    `https://wa.me//55${user.phone.replace(/[^0-9]/g, "")}?text=${message}`,
    {
      external: true,
    }
  );
}
