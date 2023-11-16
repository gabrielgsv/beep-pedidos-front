<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import { getProducts } from "../services";
import { createProduct, uploadImage } from "./services";

type PropsType = {
  isEditing?: boolean;
  product?: {
    id: number;
    name: string;
    image_url: string;
    description: string;
    price: number;
    additional: {
      name: string;
      value: number;
    }[];
  };
};
const props = defineProps<PropsType>();

const toast = useToast();
const isOpen = ref(false);
const isLoading = ref(false);

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

const productId = ref(props.product?.id);

function onOpenEditing() {
  if (props.isEditing && props.product) {
    productState.name = props.product.name;
    productState.image = props.product.image_url;
    productState.description = props.product.description;
    productState.price = props.product.price.toString();
    productState.additional = props.product.additional;

    imagePreview.value = props.product.image_url;
  }

  isOpen.value = true;
}

const imagePreview = ref();

function onSubmit(event: FormSubmitEvent<ProductType>) {
  function sucess() {
    isLoading.value = false;
    isOpen.value = false;
    getProducts();
    toast.add({
      title: "Sucesso",
      description: "Produto criado com sucesso",
      timeout: 8000,
      color: "green",
    });
  }

  function error() {
    isLoading.value = false;
    toast.add({
      title: "Erro",
      description: "Erro ao criar o produto",
      color: "red",
      timeout: 8000,
    });
  }
  isLoading.value = true;

  if (event.data?.image instanceof File) {
    uploadImage(event.data)
      .then(({ data }) => {
        const imageUrl: string = data.data.url;
        createProduct(event.data, imageUrl)
          .then(() => sucess())
          .catch(() => error());
      })
      .catch(() => error());
  } else {
    createProduct(event.data)
      .then(() => sucess())
      .catch(() => error());
  }
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
</script>

<template>
  <div>
    <UButton
      v-if="props.isEditing"
      color="primary"
      @click="onOpenEditing"
      label="Editar"
    />

    <UButton
      v-else
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
              <div class="additional-container">
                <div
                  v-for="(i, index) in productState.additional"
                  class="additional"
                  :key="index"
                >
                  <UFormGroup
                    class="w-56"
                    label="Nome"
                    name="additional-name"
                    v-model="i.name"
                  >
                    <UInput v-model="i.name" />
                  </UFormGroup>

                  <UFormGroup
                    class="w-32"
                    label="Preço"
                    name="additional-value"
                  >
                    <UInput
                      v-model="i.value"
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

                  <UButton
                    icon="i-heroicons-trash"
                    color="red"
                    class="rounded-full h-[32px] mt-5"
                    @click="productState.additional.splice(index, 1)"
                  />
                </div>
              </div>

              <UButton icon="i-heroicons-plus" @click="addAdditional" />
            </UFormGroup>
          </div>
          <div class="buttons">
            <UButton type="submit" :loading="isLoading">Adicionar</UButton>
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

.additional-container {
  max-height: 210px;
  overflow-y: auto;
  padding-right: 10px;
}

.additional-container::-webkit-scrollbar {
  width: 5px; /* width of the entire scrollbar */
}

.additional-container::-webkit-scrollbar-thumb {
  background-color: #8f8f8f; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
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
./services
