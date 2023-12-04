export function createOrders() {
  const ordersStore = useOrdersStore();
  const { orders, productsOrders, user } = ordersStore;
  debugger;
  return api().post("/orders", {
    ...orders,
    user_id: user.user_id,
    products_orders: productsOrders,
  });
}
