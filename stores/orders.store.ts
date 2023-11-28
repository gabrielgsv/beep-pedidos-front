type ProductsOrdersType = {
  productId: number;
  productName: string;
  price: number;
  subtotal: number;
  additional: {
    name: string;
    value: number;
    count: number;
  }[];
};

type OrdersType = {
  paymentType: string;
  total: number;
};

export const useOrdersStore = defineStore("orders", {
  state: (): {
    orders: OrdersType[];
    productsOrders: ProductsOrdersType[];
  } => ({
    orders: [],
    productsOrders: [],
  }),

  actions: {
    addProduct(product: ProductsOrdersType) {
      let subtotal: number = product.price;
      product.additional.forEach((additional) => {
        subtotal += additional.value * additional.count;
      });

      this.productsOrders.push({ ...product, subtotal });
    },
  },

  getters: {
    getTotalOrders: (state) => {
      let total: number = 0;
      state.productsOrders.forEach((product) => {
        total += product.subtotal;
      });

      debugger;
      return total;
    },
  },
});
