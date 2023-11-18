<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import { login } from "./services";

import beepPedidosLogo from "~/assets/beep-pedidos.svg";

const userToken = useCookie("userToken");

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email obrigatório" }),
  password: z.string().min(1, { message: "Senha obrigatória" }),
});

type LoginSchema = z.output<typeof loginSchema>;

onMounted(() => {
  userToken.value = null;
});

const loginState = reactive<LoginSchema>({
  email: "",
  password: "",
});

const loading = ref(false);

function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  const { email, password } = event.data;
  loading.value = true;
  return login(email, password)
    .then(() => {
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div class="container">
    <UCard class="card">
      <template #header>
        <div class="header">
          <h1 class="title">Login</h1>
          <img :src="beepPedidosLogo" alt="Beep Pedidos" width="100" />
        </div>
      </template>

      <UForm :schema="loginSchema" :state="loginState" @submit="onSubmit">
        <UFormGroup class="input" label="Email" name="email">
          <UInput v-model="loginState.email" />
        </UFormGroup>

        <UFormGroup class="input" label="Senha" name="password">
          <UInput v-model="loginState.password" type="password" />
        </UFormGroup>

        <div class="button">
          <UButton block type="submit" :loading="loading">Entrar</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.card {
  width: 400px;
  height: 500px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  text-align: center;
  font-size: 18pt;
  font-weight: bold;
}

.input {
  margin: 30px 20px;
  margin-top: 0;
}

.button {
  margin: 40px 20px;
}
</style>
