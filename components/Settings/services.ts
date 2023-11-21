type UserType = {
  name: string;
  url: string;
  phone: string;
  cpf_cnpj: string;
  cep: string;
  addreas: string;
  address_number: string;
  neighborhood: string;
  city: string;
  state: string;
  delivery_fee: string;
  delivery_time: string;
  complement: string;
  timetables: {
    name: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  image?: any;
};

export function getUserById() {
  const id = useCookie("userId");
  return api().get(`/users/by-id?id=${id.value}`);
}

export function updateUser(user: UserType) {
  const userId = useCookie("userId");
  return api().patch("/users", {
    ...user,
    id: userId.value,
    address_number: parseInt(user.address_number),
    delivery_fee: parseFloat(user.delivery_fee.replace(",", ".")),
  });
}

export function uploadImage(product: UserType) {
  return api().post(
    "/products/image-upload",
    {
      file: product.image,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
