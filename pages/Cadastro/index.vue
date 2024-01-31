<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import { register } from "./services";

import beepPedidosLogo from "~/assets/beep-pedidos.svg";

const userToken = useCookie("userToken");

const registerSchema = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  email: z.string().min(1, { message: "Email obrigatório" }),
  password: z
    .string()
    .min(10, { message: "Senha deve ter no minimo 10 caracteres" })
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula"),
  url: z.string().optional(),
});

type RegisterSchema = z.output<typeof registerSchema>;

onMounted(() => {
  userToken.value = null;
});

const registerState = reactive<RegisterSchema>({
  name: "",
  email: "",
  password: "",
  url: "",
});

const loading = ref(false);

function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  const { name, email, password, url } = event.data;
  loading.value = true;
  return register(name, email, password, url)
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
          <h1 class="title">Cadastro</h1>
          <img :src="beepPedidosLogo" alt="Beep Pedidos" width="100" />
        </div>
      </template>

      <UForm :schema="registerSchema" :state="registerState" @submit="onSubmit">
        <UFormGroup class="input" label="Nome do estabelecimento" name="name">
          <UInput
            v-model="registerState.name"
            placeholder="Beep Pedidos"
            required
          />
        </UFormGroup>

        <UFormGroup class="input" label="Email" name="email">
          <UInput
            v-model="registerState.email"
            placeholder="beep-pedidos@mail.com"
            required
          />
        </UFormGroup>

        <UFormGroup class="input" label="Senha" name="password">
          <UInput
            v-model="registerState.password"
            type="password"
            placeholder="********"
            required
          />
        </UFormGroup>

        <UFormGroup class="input" label="Url" name="url">
          <UInput v-model="registerState.url" placeholder="beep-pedidos" />
        </UFormGroup>

        <div class="button">
          <UButton block type="submit" :loading="loading">Cadastrar</UButton>
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
  height: 650px;
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
