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
  created_at: Date;
};

const userId = useCookie("userId");
const orders = ref<OrderType[]>([]);
const page = ref(1);
const pageCount = 5;
const totalCount = ref(0);
const initialIndex = computed(() => (page.value - 1) * pageCount);
const finalIndex = computed(() => initialIndex.value + pageCount);

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
        <UCard
          v-if="index >= initialIndex && index <= finalIndex"
          class="w-[350px] m-3"
        >
          <template #header>
            <p class="order-title text-lg font-semibold">{{ order.name }}</p>
            <p class="order-title text-sm">
              {{ formatDate(order.created_at) }}
            </p>
          </template>

          <div class="order-body">
            <div v-for="product in order.products_orders">
              <p>Nome: {{ product.productName }}</p>
              <p
                class="mt-3 font-semibold"
                v-if="product.additional.length > 0"
              >
                Adicionais:
              </p>
              <div v-for="additional in product.additional">
                <p v-if="additional.count > 0" class="text-sm">
                  +{{ additional.count }} {{ additional.name }}
                </p>
              </div>

              <p class="mt-3">
                Subtotal: {{ convertToMoneyString(product.subtotal) }}
              </p>
              <UDivider class="my-5" />
            </div>
            <p class="text-center text-lg">Entrega</p>
            <p class="text-sm">Endereço: {{ order.address }}</p>
            <p class="text-sm">Número: {{ order.address_number }}</p>
            <p class="text-sm">Bairro: {{ order.neighborhood }}</p>
            <p class="text-sm">Cidade: {{ order.city }}</p>
          </div>

          <template #footer>
            <p class="font-semibold">
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
    <UPagination
      v-model="page"
      :page-count="pageCount"
      :total="totalCount"
      size="lg"
      class="my-8 mr-14 float-right"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  margin-top: 50px;
  margin-left: 2%;
}

.order-title {
  display: flex;
  justify-content: center;
}
</style>
