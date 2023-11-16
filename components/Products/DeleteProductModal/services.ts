export function deleteProduct(id: number) {
  const userId = useCookie("userId");
  return api().delete(`/products?id=${id}&user_id=${userId.value}`);
}
