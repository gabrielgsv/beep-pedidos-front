<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
const isOpen = ref(false);

const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  image: z
    .any()
    .refine((file) => file?.size, "Imagem obrigatória")
    .refine((file) => file?.size <= 4000000, "Tamanho máximo é 4MB")
    .refine(
      (file) => file?.type?.includes("image/jpeg", "image/png", "image/jpg"),
      "Formato inválido"
    ),
  description: z.string().min(1, "Descrição obrigatória"),
  // price: z.number().min(1, "Preço obrigatório"),
  // additional: z.string(),
});

type ProductType = z.output<typeof productSchema>;

const productState = reactive<ProductType>({
  name: "",
  image: "",
  description: "",
  // price: 0,
  // additional: "",
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

  imagePreview.value = "";
}
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
          <UFormGroup label="Nome" name="name">
            <UInput v-model="productState.name" />
          </UFormGroup>

          <UFormGroup label="Imagem" name="image">
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
          </UFormGroup>

          <UFormGroup label="Descrição" name="description">
            <UTextarea v-model="productState.description" />
          </UFormGroup>

          <div class="buttons">
            <UButton type="submit">Adicionar</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.added-button {
  float: right;
  margin: 30px;
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
  color: #f1f1f1;
  border-radius: 8px;
}

.label-image label {
  cursor: pointer;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
