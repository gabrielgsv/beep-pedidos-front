<script setup lang="ts">
import OrderBag from "~/components/OrderProduct/OrderBag/index.vue";
import { type UserType } from "./types";
const route = useRoute();
const { user } = useOrdersStore();

const userValues = ref<UserType | null>();
const isLoading = ref(true);

onMounted(() => {
  api()
    .get(`/users/by-url?url=${route.params.url}`)
    .then((res) => {
      userValues.value = res.data;
      user.user_id = res.data.id;
      user.delivery_fee = res.data.delivery_fee;
      user.phone = res.data.phone;
      isLoading.value = false;
    })
    .catch((error) => {
      console.error(error);
      isLoading.value = false;
    });
});
</script>

<template>
  <div class="container">
    <UProgress v-if="isLoading" animation="carousel" class="mt-3" />
    <p v-else-if="!user && !isLoading">Estabelecimento não encontrado</p>
    <div v-else class="max-w-3xl">
      <div class="title-container">
        <img :src="userValues?.image_url" alt="Logotipo do estabelecimento" />
        <p class="text-xl font-semibold">{{ userValues?.name }}</p>
        <div class="deliver">
          <p class="text-center text-xs">
            Entrega Aproximada: {{ userValues?.delivery_time }}min -
            {{ convertToMoneyString(user?.delivery_fee) }}
          </p>
        </div>
      </div>
      <OrderProduct v-if="userValues" :products="userValues.products" />
    </div>
  </div>
  <OrderBag />
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px;
}

.title-container img {
  width: 100px;
}

.deliver {
  display: flex;
  justify-content: center;
  max-width: 500px;
  width: 80vw;
  border: 1px solid #000;
  border-radius: 30px;
  padding: 10px;
}
</style>
./types
