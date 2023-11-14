<script lang="ts">
export default {
  props: ["product"],
};
</script>

<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <div>
    <UButton color="primary" @click="isOpen = true"> Editar </UButton>

    <UModal v-model="isOpen">
      <p>{{ product }} }}</p>
    </UModal>
  </div>
</template>

<style scoped></style>
