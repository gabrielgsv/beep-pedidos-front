<script setup lang="ts">
const props = defineProps(["product"]);
import { deleteProduct } from "./services";

const store = useProductsStore();
const toast = useToast();
const isOpen = ref(false);
const isLoading = ref(false);

function onDelete() {
  isLoading.value = true;
  deleteProduct(props.product.id)
    .then(() => {
      store.$patch((state) => {
        state.products = state.products.filter(
          (product) => product.id !== props.product.id
        );
      });
      isLoading.value = false;
      isOpen.value = false;
      toast.add({
        title: "Sucesso",
        description: "Produto excluido com sucesso",
        timeout: 8000,
        color: "green",
      });
    })
    .catch(() => {
      isOpen.value = false;
      isLoading.value = false;
      toast.add({
        title: "Erro",
        description: "Erro ao excluir o produto",
        timeout: 8000,
        color: "red",
      });
    });
}
</script>

<template>
  <div>
    <UButton color="red" @click="isOpen = true">Excluir</UButton>

    <UModal v-model="isOpen">
      <UCard class="text-center">
        <p class="text-lg my-6">Tem certeza que deseja excluir este produto?</p>

        <div class="actions">
          <UButton @click="isOpen = false" :loading="isLoading"
            >Cancelar</UButton
          >
          <UButton color="red" @click="onDelete" :loading="isLoading"
            >Excluir</UButton
          >
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
