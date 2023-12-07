<script setup lang="ts">
type OrderType = {
  name: string;
  payment_type: string;
  phone: string;
  total: number;
  products_orders: {
    price: number;
    subtotal: number;
    productId: number;
    productName: string;
    additional: {
      name: string;
      count: number;
      value: number;
    }[];
  }[];
  change: number;
  address: string;
  address_number: string;
  neighborhood: string;
  complement: string;
  cep: string;
  city: string;
  state: string;
};

const userId = useCookie("userId");
const orders = ref<OrderType[]>([]);

onMounted(() => {
  api()
    .get(`/orders/${userId.value}`)
    .then(({ data }) => {
      orders.value = data as OrderType[];
      debugger;
    });
});
</script>

<template>
  <div>
    <h1>Pedidos</h1>
    {{ orders.map((order) => order.name) }}
  </div>
</template>

<style scoped></style>
