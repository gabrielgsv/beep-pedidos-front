type ProductType = {
  name: string;
  description: string;
  price: string;
  image?: any;
  additional?: any;
};

type AdditionalType = {
  name: string;
  value: any;
};

export function createProduct(product: ProductType, imageUrl?: string) {
  const userId = useCookie("userId");
  let newAdditionals: AdditionalType[] = product.additional;
  if (newAdditionals.length > 0) {
    newAdditionals = newAdditionals.map((item) => {
      return {
        ...item,
        value: parseFloat(item.value.replace(",", ".")),
      };
    });
  }

  return api().post("/products", {
    ...product,
    additional: newAdditionals,
    image_url: imageUrl,
    price: parseFloat(product.price.replace(",", ".")),
    user_id: userId.value,
  });
}

export function uploadImage(product: ProductType) {
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
