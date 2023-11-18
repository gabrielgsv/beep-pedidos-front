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

export function createProduct(
  product: ProductType,
  isEditing: boolean,
  productId?: number,
  imageUrl?: string
) {
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

  if (isEditing) {
    return api().patch(`/products?id=${productId}&user_id=${userId.value}`, {
      ...product,
      additional: newAdditionals,
      image_url: imageUrl,
      price: parseFloat(product.price.replace(",", ".")),
    });
  } else {
    return api().post("/products", {
      ...product,
      additional: newAdditionals,
      image_url: imageUrl,
      price: parseFloat(product.price.replace(",", ".")),
      user_id: userId.value,
    });
  }
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
