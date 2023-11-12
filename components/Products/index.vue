<script setup lang="ts">
const userId = useCookie("userId");

let products = ref([]);
const columns = ref([
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "price",
    label: "Preço",
  },
  {
    key: "description",
    label: "Descrição",
  },
  {
    key: "actions",
    label: "Ações",
  },
]);

api()
  .get(`products/${userId.value}`)
  .then((res) => {
    products.value = res.data;
  });
</script>

<template>
  <div>
    <h1>Produtos</h1>

    <UTable class="product-table" :rows="products" :columns="columns">
      <template #name-data="{ row }">
        <div class="table-text w-[300px]">{{ row.name }}</div>
      </template>

      <template #price-data="{ row }">
        <div class="table-text w-[70px]">{{ row.price }}</div>
      </template>

      <template #description-data="{ row }">
        <div class="table-text w-[300px]">{{ row.description }}</div>
      </template>

      <template #actions-data="{ row }">
        <UButton color="green" :href="`/dashboard/products/${row.id}`">
          Editar
        </UButton>
      </template>
    </UTable>
  </div>
</template>

<style scoped>
.product-table {
  width: 100%;
}

.table-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
