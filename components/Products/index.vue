<script setup lang="ts">
import CreateProductModal from "./CreateProductModal/index.vue";
import DeleteProductModal from "./DeleteProductModal/index.vue";
import { useProductsStore } from "~/stores/products.store";
import { getProducts } from "./services";
const store = useProductsStore();

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

getProducts();
</script>

<template>
  <div>
    <CreateProductModal />
    <UTable
      class="product-table"
      :rows="store.products"
      :columns="columns"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Carregando...',
      }"
      :loading="store.loading"
    >
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
          <CreateProductModal :is-editing="true" :product="row" />
          <DeleteProductModal :product="row" />
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
