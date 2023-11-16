export function getProducts() {
  const store = useProductsStore();
  const userId = useCookie("userId");

  store.$patch((state) => {
    state.loading = true;
  });
  api()
    .get(`products/${userId.value}`)
    .then((res) => {
      store.$patch((state) => {
        state.products = res.data;
        state.loading = false;
      });
    });
}
