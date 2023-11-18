import { defineStore } from "pinia";

type ProductType = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  price: number;
  additional: {
    name: string;
    value: string;
  }[];
};

export const useProductsStore = defineStore("products", {
  state: (): { products: ProductType[]; loading: boolean } => ({
    products: [],
    loading: false,
  }),
});
