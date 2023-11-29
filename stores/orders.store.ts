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
  name: string;
  phone: string;
  paymentType: string;
  total: number;
  change?: string;
};

export const useOrdersStore = defineStore("orders", {
  state: (): {
    orders: OrdersType;
    productsOrders: ProductsOrdersType[];
  } => ({
    orders: {
      paymentType: "",
      name: "",
      phone: "",
      total: 0,
      change: "R$ 0,00",
    },
    productsOrders: [],
  }),

  actions: {
    addProduct(product: ProductsOrdersType) {
      let subtotal: number = product.price;
      let total: number = 0;
      product.additional.forEach((additional) => {
        subtotal += additional.value * additional.count;
      });

      this.productsOrders.push({ ...product, subtotal });
      this.productsOrders.forEach((product) => {
        total += product.subtotal;
      });
      this.orders = {
        paymentType: "Cartão de Crédito",
        name: "",
        phone: "",
        total: total,
      };
    },
  },
});
