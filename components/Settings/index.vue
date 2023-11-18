<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from "axios";
import { z } from "zod";

const settingSchemna = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  url: z.string().min(1, { message: "Url obrigatório" }),
  cep: z.string(),
  addreas: z.string().min(1, { message: "Endereço obrigatório" }),
  address_number: z.number().min(1, { message: "Número obrigatório" }),
  neighborhood: z.string().min(1, { message: "Bairro obrigatório" }),
  city: z.string().min(1, { message: "Cidade obrigatório" }),
  state: z.string().min(1, { message: "Estado obrigatório" }),
  image_url: z.string().min(1, { message: "Logo obrigatório" }),
});

type SettingsType = z.output<typeof settingSchemna>;

const settingState = reactive<SettingsType>({
  name: "",
  url: "",
  cep: "",
  addreas: "",
  address_number: 0,
  neighborhood: "",
  city: "",
  state: "",
  image_url: "",
});

function onSubmit(event: FormSubmitEvent<SettingsType>) {
  debugger;
}

console.log("settingState", settingState.cep);

watch(
  () => settingState.cep,
  (value) => {
    if (value.length === 9) {
      const cep = Number(value.replace("-", ""));
      axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(({ data }) => {
        settingState.addreas = data.logradouro;
        settingState.neighborhood = data.bairro;
        settingState.city = data.localidade;
        settingState.state = data.uf;
      });
    }
  }
);
</script>

<template>
  <div>
    <h1>Settings</h1>

    <UForm :schema="settingSchemna" :state="settingState" @submit="onSubmit">
      <UFormGroup label="Nome" name="name">
        <UInput v-model="settingState.name" />
      </UFormGroup>

      <UFormGroup label="Url" name="url">
        <UInput v-model="settingState.url" />
      </UFormGroup>

      <UFormGroup label="Logo" name="image_url">
        <UInput v-model="settingState.image_url" />
      </UFormGroup>

      <UFormGroup label="CEP" name="cep">
        <UInput v-model="settingState.cep" v-maska data-maska="#####-###" />
      </UFormGroup>

      <UFormGroup label="Cidade" name="city">
        <UInput v-model="settingState.city" />
      </UFormGroup>

      <UFormGroup label="Estado" name="state">
        <UInput v-model="settingState.state" />
      </UFormGroup>

      <UFormGroup label="Endereço" name="addreas">
        <UInput v-model="settingState.addreas" />
      </UFormGroup>

      <UFormGroup label="Bairro" name="neighborhood">
        <UInput v-model="settingState.neighborhood" />
      </UFormGroup>

      <UFormGroup label="Número" name="address_number">
        <UInput v-model="settingState.address_number" />
      </UFormGroup>
    </UForm>
  </div>
</template>

<style scoped></style>
