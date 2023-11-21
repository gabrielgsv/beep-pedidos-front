<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from "axios";
import { z } from "zod";
import { getUserById } from "./services";

const settingSchemna = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  url: z.string().min(1, { message: "Url obrigatório" }),
  phone: z.string().min(1, { message: "Telefone obrigatório" }),
  cpf_cnpj: z.string().min(1, { message: "Cpf ou CNPJ obrigatório" }),
  cep: z.string(),
  addreas: z.string().min(1, { message: "Endereço obrigatório" }),
  address_number: z.string().min(1, { message: "Número obrigatório" }),
  neighborhood: z.string().min(1, { message: "Bairro obrigatório" }),
  city: z.string().min(1, { message: "Cidade obrigatório" }),
  state: z.string().min(1, { message: "Estado obrigatório" }),
  delivery_fee: z.string().min(1, { message: "Taxa de entrega obrigatório" }),
  delivery_time: z.string().min(1, { message: "Tempo de entrega obrigatório" }),
  complement: z.string(),
  timetables: z.array(
    z.object({
      name: z.string(),
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    })
  ),
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
  phone: "",
  cpf_cnpj: "",
  cep: "",
  addreas: "",
  address_number: "",
  neighborhood: "",
  city: "",
  state: "",
  complement: "",
  delivery_fee: "",
  delivery_time: "30",
  timetables: [
    { name: "Domingo", open: "00:00", close: "00:00", isOpen: true },
    { name: "Segunda", open: "00:00", close: "00:00", isOpen: true },
    { name: "Terça", open: "00:00", close: "00:00", isOpen: true },
    { name: "Quarta", open: "00:00", close: "00:00", isOpen: true },
    { name: "Quinta", open: "00:00", close: "00:00", isOpen: true },
    { name: "Sexta", open: "00:00", close: "00:00", isOpen: true },
    { name: "Sábado", open: "00:00", close: "00:00", isOpen: true },
  ],
  image: "",
});

const imagePreview = ref();

onMounted(() => {
  getUserById()
    .then(({ data }) => {
      settingState.name = data.name;
      settingState.url = data.url;
      settingState.phone = data.phone;
      settingState.cpf_cnpj = data.cpf_cnpj;
      settingState.cep = data.cep;
      settingState.addreas = data.addreas;
      settingState.address_number = data.address_number;
      settingState.neighborhood = data.neighborhood;
      settingState.city = data.city;
      settingState.state = data.state;
      settingState.complement = data.complement;
      settingState.delivery_fee = convertCurrency(data.delivery_fee);
      settingState.delivery_time = data.delivery_time.toString();
      settingState.timetables = data.timetables;
      settingState.image = data.image;
    })
    .catch((error) => {
      debugger;
    });
});

function onSubmit(event: FormSubmitEvent<SettingsType>) {
  debugger;
}

console.log("settingState", settingState.cep);

watch(
  () => settingState.cep,
  (value) => {
    if (value?.length === 9) {
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

        <UFormGroup label="Telefone com Whatsapp" name="phone" class="w-52">
          <UInput
            v-model="settingState.phone"
            v-maska
            data-maska="['(##) ####-####', '(##) #####-####']"
          />
        </UFormGroup>

        <UFormGroup label="CPF ou CNPJ" name="cpf_cnpj" class="w-52">
          <UInput
            v-model="settingState.cpf_cnpj"
            v-maska
            data-maska="['###.###.###-##', '##.###.###/####-##']"
          />
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

        <UFormGroup label="Complemento" name="complement" class="w-52">
          <UInput v-model="settingState.complement" />
        </UFormGroup>
        <UFormGroup label="Tempo de entrega" name="delivery_time" class="w-36">
          <UInput
            v-model="settingState.delivery_time"
            v-maska
            data-maska="###"
            class="w-20"
          >
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">Min</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup class="w-36" label="Taxa de entrega" name="delivery_fee">
          <UInput
            v-model="settingState.delivery_fee"
            v-maska
            data-maska="0,99"
            data-maska-eager
            data-maska-reversed
            data-maska-tokens="0:\d:multiple|9:\d:optional"
          >
            <template #leading>
              <span>R$</span>
            </template>
          </UInput>
        </UFormGroup>
      </div>
      <div class="flex flex-wrap gap-28">
        <UFormGroup class="w-52 ml-[40px] mt-7" label="Logo" name="image">
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
        <div class="timestable">
          <div
            class="time-item"
            v-for="time in settingState.timetables"
            :key="time.name"
          >
            <span class="time-name">{{ time.name }}</span>
            <UFormGroup
              label="Aberto das"
              :name="time.open"
              class="w-24"
              v-if="time.isOpen"
            >
              <UInput v-model="time.open" v-maska data-maska="##:##" />
            </UFormGroup>

            <UFormGroup
              label="Fecha as"
              :name="time.close"
              class="w-24"
              v-if="time.isOpen"
            >
              <UInput v-model="time.close" v-maska data-maska="##:##" />
            </UFormGroup>

            <span v-else class="close-text">Fechado</span>

            <UButton variant="outline" @click="time.isOpen = !time.isOpen">
              Aberto/Fechado
            </UButton>
          </div>
        </div>
      </div>
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

.timestable {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 30px;
  width: 600px;
  margin-top: 50px;
}

.time-item {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 20px;
  height: 56px;
}

.time-name {
  width: 70px;
  font-weight: bold;
  margin-bottom: 5px;
}

.close-text {
  width: 240px;
  text-align: center;
  margin-bottom: 5px;
  color: #ef4444;
  font-weight: bold;
  font-size: 14pt;
}
</style>
