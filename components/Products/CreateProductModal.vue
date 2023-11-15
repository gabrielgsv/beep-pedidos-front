<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";

const isOpen = ref(false);

const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  image: z
    .any()
    .refine((file) => !file || file?.size <= 4000000, "Tamanho máximo é 4MB")
    .refine(
      (file) =>
        !file || file?.type?.includes("image/jpeg", "image/png", "image/jpg"),
      "Formato inválido"
    ),
  description: z.string(),
  price: z.string().min(1, "Preço obrigatório"),
  additional: z.any(),
});

type ProductType = z.output<typeof productSchema>;

const productState = reactive<ProductType>({
  name: "",
  image: "",
  description: "",
  price: "",
  additional: [],
});

const imagePreview = ref();

function onSubmit(event: FormSubmitEvent<ProductType>) {
  debugger;
}

function onFileChange(event: any) {
  const file = event?.target.files[0];
  if (!file) return;

  productState.image = file;

  const reader = new FileReader();

  reader.onload = () => {
    imagePreview.value = reader.result;
  };

  reader.readAsDataURL(file);
}

function onClose() {
  productState.name = "";
  productState.image = "";
  productState.description = "";
  productState.price = "";

  imagePreview.value = "";
}

function addAdditional() {
  productState.additional = [
    ...productState.additional,
    { name: "", value: "" },
  ];
}

console.log("productState", productState);
</script>

<template>
  <div>
    <UButton
      label="Adicionar Produto"
      class="added-button"
      color="primary"
      @click="isOpen = true"
      icon="i-heroicons-plus"
    />

    <UModal v-model="isOpen" @close="onClose">
      <UCard>
        <UForm :schema="productSchema" :state="productState" @submit="onSubmit">
          <div class="form">
            <UFormGroup class="w-[65%]" label="Nome" name="name">
              <UInput v-model="productState.name" />
            </UFormGroup>

            <UFormGroup class="w-[25%]" label="Preço" name="price">
              <UInput
                v-model="productState.price"
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

            <UFormGroup class="w-full" label="Imagem" name="image">
              <div class="image-group">
                <div class="label-image">
                  <label for="upload-image">Escolher Imagem</label>
                </div>
                <UInput
                  id="upload-image"
                  type="file"
                  class="input-file"
                  accept="image/x-png,image/jpeg"
                  @change="onFileChange"
                />

                <img v-if="imagePreview" :src="imagePreview" alt="image" />
              </div>
            </UFormGroup>

            <UFormGroup class="w-full" label="Descrição" name="description">
              <UTextarea class="w-full" v-model="productState.description" />
            </UFormGroup>

            <UFormGroup label="Adicionais">
              <div v-for="(i, index) in productState.additional">
                <div class="additional">
                  <UFormGroup
                    class="w-full"
                    label="Nome"
                    name="additional-name"
                  >
                    <UInput v-model="i.name" />
                  </UFormGroup>

                  <UFormGroup
                    class="w-full"
                    label="Valor"
                    name="additional-value"
                  >
                    <UInput v-model="i.value" />
                  </UFormGroup>
                </div>
              </div>

              <UButton icon="i-heroicons-plus" @click="addAdditional" />
            </UFormGroup>
          </div>
          <div class="buttons">
            <UButton type="submit">Adicionar</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  gap: 20px;
}
.added-button {
  float: right;
  margin: 30px;
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
  width: 150px;
  height: 40px;
  background-color: #3b82f6;
  text-align: center;
  padding: 7px;
  color: #ffffff;
  font-weight: 500;
  border-radius: 8px;
}

.label-image label {
  cursor: pointer;
}

img {
  max-width: 150px;
  max-height: 150px;
  align-self: flex-start;
  border: 3px solid #3b82f6;
  border-radius: 5px;
}

.additional {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
