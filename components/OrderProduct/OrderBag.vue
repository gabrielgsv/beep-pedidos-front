<script setup lang="ts">
const { getTotalOrders } = useOrdersStore();

const isModelOpen = ref(false);
</script>

<template>
  <UModal v-model="isModelOpen" prevent-close>
    <UCard>
      <template #header> Seu Pedido </template>
    </UCard>
  </UModal>
  <div class="bag">
    <div class="bag-button" v-if="getTotalOrders > 0">
      <UButton block size="xl">
        Ver carrinho {{ convertToMoneyString(getTotalOrders) }}
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.bag {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 5px;
  width: 92vw;
}
.bag-button {
  width: 100%;
  max-width: 700px;
}
</style>
