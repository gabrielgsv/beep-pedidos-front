<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from "axios";
import { z } from "zod";

const settingSchemna = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  url: z.string().min(1, { message: "Url obrigatório" }),
  cep: z.string(),
  addreas: z.string().min(1, { message: "Endereço obrigatório" }),
  address_number: z.string().min(1, { message: "Número obrigatório" }),
  neighborhood: z.string().min(1, { message: "Bairro obrigatório" }),
  city: z.string().min(1, { message: "Cidade obrigatório" }),
  state: z.string().min(1, { message: "Estado obrigatório" }),
  image: z
    .any()
    .refine((file) => !file || file?.size <= 4000000, "Tamanho máximo é 4MB")
    .refine(
      (file) =>
        !file || file?.type === "image/jpeg" || "image/png" || "image/jpg",
      "Formato inválido"
    ),
});

type SettingsType = z.output<typeof settingSchemna>;

const settingState = reactive<SettingsType>({
  name: "",
  url: "",
  cep: "",
  addreas: "",
  address_number: "",
  neighborhood: "",
  city: "",
  state: "",
  image: "",
});

const imagePreview = ref();

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

function onFileChange(event: any) {
  const file = event?.target.files[0];
  if (!file) return;
  settingState.image = file;

  const reader = new FileReader();

  reader.onload = () => {
    imagePreview.value = reader.result;
  };

  reader.readAsDataURL(file);
}
</script>

<template>
  <div>
    <UForm :schema="settingSchemna" :state="settingState" @submit="onSubmit">
      <div class="form-container">
        <UFormGroup label="Nome" name="name" class="w-72">
          <UInput v-model="settingState.name" />
        </UFormGroup>

        <UFormGroup label="Url" name="url" class="w-52">
          <UInput v-model="settingState.url" />
        </UFormGroup>

        <UFormGroup label="CEP" name="cep" class="w-52">
          <UInput v-model="settingState.cep" v-maska data-maska="#####-###" />
        </UFormGroup>

        <UFormGroup label="Cidade" name="city" class="w-52">
          <UInput v-model="settingState.city" />
        </UFormGroup>

        <UFormGroup label="Estado" name="state" class="w-20">
          <UInput v-model="settingState.state" />
        </UFormGroup>

        <UFormGroup label="Endereço" name="addreas" class="w-80">
          <UInput v-model="settingState.addreas" />
        </UFormGroup>

        <UFormGroup label="Bairro" name="neighborhood" class="w-52">
          <UInput v-model="settingState.neighborhood" />
        </UFormGroup>

        <UFormGroup label="Número" name="address_number" class="w-24">
          <UInput
            v-model="settingState.address_number"
            v-maska
            data-maska="#####"
          />
        </UFormGroup>
      </div>
      <UFormGroup class="w-full ml-[40px] mt-7" label="Logo" name="image">
        <div class="image-group">
          <div class="label-image">
            <label for="upload-image">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="image"
                class="mb-5"
              />
              {{ imagePreview ? "Alterar imagem" : "Selecionar imagem" }}
            </label>
          </div>
          <UInput
            id="upload-image"
            type="file"
            class="input-file"
            accept="image/x-png,image/jpeg"
            @change="onFileChange"
          />
        </div>
      </UFormGroup>
      <div class="buttons">
        <UButton type="submit" size="xl">Salvar</UButton>
      </div>
    </UForm>
  </div>
</template>

<style scoped>
.form-container {
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 40px;
}
.image-group {
  display: flex;
  justify-content: space-between;
  width: 90%;
  min-height: 50px;
}

.input-file {
  display: none;
}

.label-image {
  cursor: pointer;
  width: 200px;
  text-align: center;
  border: 2px solid #d1d5db;
  padding: 10px;
  font-weight: 500;
  border-radius: 8px;
}

label {
  cursor: pointer;
}

.buttons {
  float: right;
  margin-right: 50px;
}
</style>
