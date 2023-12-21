type AdditionalType = {
  category: string;
  limit: number;
  additional: {
    name: string;
    value: any;
  }[];
};

type ProductType = {
  name: string;
  image_url?: string;
  image?: any;
  description: string;
  price: any;
  additional: AdditionalType[];
};

export function createProduct(
  product: ProductType,
  isEditing: boolean,
  productId?: number,
  imageUrl?: string
) {
  const userId = useCookie("userId");
  let newAdditionals = product.additional;
  if (newAdditionals.length > 0) {
    newAdditionals = newAdditionals.map((additionalCategory) => {
      additionalCategory.additional = additionalCategory.additional.map(
        (item) => {
          return {
            ...item,
            value: parseFloat(item.value.replace(",", ".")),
          };
        }
      );
      return additionalCategory;
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
    "/image-upload",
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
