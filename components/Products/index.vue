<script setup lang="ts">
import EditProductModal from "./EditProductModal.vue";
import CreateProductModal from "./CreateProductModal.vue";
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
    <CreateProductModal />
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
        <div class="actions">
          <EditProductModal :product="row" />
          <UButton color="red">Excluir</UButton>
        </div>
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

.actions {
  display: flex;
  gap: 10px;
}
</style>
