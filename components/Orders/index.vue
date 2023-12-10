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
const page = ref(1);
const pageCount = 5;
const totalCount = ref(0);

onMounted(() => {
  api()
    .get(`/orders/${userId.value}`)
    .then(({ data }) => {
      orders.value = data as OrderType[];
      totalCount.value = data.length;
    });
});
</script>

<template>
  <div>
    <div class="container">
      <div v-for="(order, index) in orders">
        <UCard v-if="index + 1" class="w-[350px]">
          <template #header>
            <p class="order-title">{{ order.name }}</p>
          </template>

          <div class="order-body">
            <div v-for="product in order.products_orders">
              <p>Nome: {{ product.productName }}</p>
              <p class="mt-3" v-if="product.additional.length > 0">
                Adicionais:
              </p>
              <div v-for="additional in product.additional">
                <p v-if="additional.count > 0">
                  +{{ additional.count }} {{ additional.name }}
                </p>
              </div>

              <p class="mt-3">
                Subtotal: {{ convertToMoneyString(product.subtotal) }}
              </p>
              <UDivider class="my-5" />
            </div>
            <p class="text-center">Entrega</p>
            <p>Endereço: {{ order.address }}</p>
            <p>Número: {{ order.address_number }}</p>
            <p>Bairro: {{ order.neighborhood }}</p>
            <p>Cidade: {{ order.city }}</p>
          </div>

          <template #footer>
            <p>
              Total: {{ convertToMoneyString(order.total) }} -
              {{
                order.payment_type === "money"
                  ? `Dinheiro - Troca para R$
              ${convertToMoneyString(order.change)}`
                  : `Cartão`
              }}
            </p>
          </template>
        </UCard>
      </div>
    </div>
    <UPagination v-model="page" :page-count="pageCount" :total="totalCount" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
}

.order-title {
  display: flex;
  justify-content: center;
}
</style>
