type ProductsOrdersType = {
  productId: number;
  productName: string;
  price: number;
  subtotal: number;
  additional: {
    category: string;
    limit: number;
    additional: {
      name: string;
      value: any;
      count: number;
    }[];
  }[];
};

type OrdersType = {
  name: string;
  phone: string;
  payment_type: string;
  total: number;
  change?: string;
  cep?: string;
  address?: string;
  address_number?: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;
  isDelivery: boolean;
};

type UserType = {
  user_id: number;
  delivery_fee: number;
  phone: string;
};

export const useOrdersStore = defineStore("orders", {
  state: (): {
    orders: OrdersType;
    productsOrders: ProductsOrdersType[];
    user: UserType;
  } => ({
    orders: {
      payment_type: "",
      name: "",
      phone: "",
      total: 0,
      change: "R$ 0,00",
      isDelivery: true,
    },
    productsOrders: [],
    user: {
      user_id: 0,
      delivery_fee: 0,
      phone: "",
    },
  }),

  actions: {
    addProduct(product: ProductsOrdersType) {
      let subtotal: number = product.price;
      let total: number = 0;
      product.additional.forEach((categories) => {
        categories.additional.forEach((additional) => {
          subtotal += additional.value * additional.count;
        });
      });

      this.productsOrders.push({ ...product, subtotal });
      this.productsOrders.forEach((product) => {
        total += product.subtotal;
      });
      this.orders = {
        payment_type: "",
        name: "",
        phone: "",
        isDelivery: true,
        total: total,
      };
    },
  },
});
