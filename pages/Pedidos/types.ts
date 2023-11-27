export type UserType = {
  id: number;
  email: string;
  name: string;
  url: string;
  phone: string;
  cpf_cnpj: string;
  created_at: string;
  cep: string;
  address: string;
  address_number: number;
  neighborhood: string;
  city: string;
  state: string;
  delivery_fee: number;
  delivery_time: number;
  complement: string;
  image_url: string;
  products: ProductsType[];
};

export type ProductsType = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  price: number;
  additional: {
    name: string;
    value: number;
  }[];
  user_id: number;
};
