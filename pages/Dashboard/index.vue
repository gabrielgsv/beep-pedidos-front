<script setup lang="ts">
const items = [
  {
    key: "orders",
    label: "Pedidos",
  },
  {
    key: "products",
    label: "Produtos",
  },
  {
    key: "settings",
    label: "Configuração do Estabelecimento",
  },
];
</script>

<template>
  <div class="conteiner">
    <UTabs :items="items">
      <template #item="{ item }">
        <div v-if="item.key === 'orders'">
          <Orders />
        </div>

        <div v-if="item.key === 'products'">
          <Products />
        </div>

        <div v-if="item.key === 'settings'">
          <Settings />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<style scoped>
.conteiner {
  margin: 30px;
}
</style>
