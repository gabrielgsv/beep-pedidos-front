<script setup lang="ts">
import { type UserType } from "./pedidos.type";
const route = useRoute();

const user = ref<UserType | null>();

onMounted(() => {
  api()
    .get(`/users/by-url?url=${route.params.url}`)
    .then((res) => {
      user.value = res.data;
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(route.params.url);
});
</script>

<template>
  <div class="container">
    <p v-if="!user">Estabelecimento não encontrado</p>
    <div v-else class="max-w-3xl">
      <div class="title-container">
        <img :src="user?.image_url" alt="Logotipo do estabelecimento" />
        <p class="text-xl font-semibold">{{ user?.name }}</p>
        <div class="deliver">
          <p class="text-center text-xs">
            Entrega Aproximada: {{ user?.delivery_time }}min -
            {{
              user?.delivery_fee.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })
            }}
          </p>
        </div>
      </div>
      <div v-for="product in user?.products" class="product">
        <UDivider class="my-4" />
        <p class="font-semibold">{{ product?.name }}</p>
        <div class="flex mt-4">
          <div class="flex flex-col w-2/3">
            <p
              class="text-xs m-3 ml-0 w-full h-24 text-ellipsis overflow-hidden"
            >
              {{ product?.description }}
            </p>
            <p class="text-sm'">
              {{
                product?.price.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })
              }}
            </p>
          </div>
          <div class="w-1/3">
            <img
              class="rounded-xl"
              :src="product?.image_url"
              alt="Imagem do produto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
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
