<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import { getProducts } from "../services";
import { createProduct, uploadImage } from "./services";
import convertCurrency from "~/utils/convertCurrency";

type ProductType = {
  id?: number;
  name: string;
  image_url?: string;
  image?: any;
  description: string;
  price: any;
  additional: {
    category: string;
    limit: number;
    additional: {
      name: string;
      value: any;
    }[];
  }[];
};
type PropsType = {
  isEditing?: boolean;
  product?: ProductType;
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
        !file || file?.type === "image/jpeg" || "image/png" || "image/jpg",
      "Formato inválido"
    ),
  description: z.string(),
  price: z.string().min(1, "Preço obrigatório"),
  additional: z.any(),
});

// type ProductType = z.output<typeof productSchema>;

const productState = reactive<ProductType>({
  name: "",
  description: "",
  price: "",
  additional: [],
});

const productId = ref(props.product?.id);

function onOpenEditing() {
  if (props.isEditing && props.product) {
    const newAdditionals = props.product.additional.map((item) => {
      return (item = {
        ...item,
        additional: item.additional.map((additionalItem) => {
          return {
            ...additionalItem,
            value: convertCurrency(additionalItem.value),
          };
        }),
      });
    });

    productState.name = props.product.name;
    productState.image = props.product.image_url;
    productState.description = props.product.description;
    productState.price = convertCurrency(props.product.price);
    productState.additional = newAdditionals;

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

  function error(error: any) {
    console.error(error);
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
        const imageUrl: string = data.data.link;
        createProduct(event.data, props.isEditing, productId.value, imageUrl)
          .then(() => sucess())
          .catch((error) => error(error));
      })
      .catch((error) => error(error));
  } else {
    createProduct(event.data, props.isEditing, productId.value)
      .then(() => sucess())
      .catch((error) => error(error));
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
  productState.image = undefined;
  productState.description = "";
  productState.price = "";

  imagePreview.value = "";
}

function addCategoryAdditional() {
  productState.additional = [
    ...productState.additional,
    { category: "Adicionais", limit: 0, additional: [] },
  ];
}

function addAdditional(index: number) {
  productState.additional[index].additional = [
    ...productState.additional[index].additional,
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

    <UModal
      v-model="isOpen"
      @close="onClose"
      :ui="{ width: 'sm:max-w-2xl' }"
      prevent-close
    >
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
                <label for="upload-image">
                  <div class="label-image">Escolher Imagem</div>
                </label>
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

            <UFormGroup label="Categoria de Adicionais">
              <div class="additional-container">
                <div
                  v-for="(i, index) in productState.additional"
                  :key="index"
                  class="additional-group"
                >
                  <div class="additional">
                    <UFormGroup
                      class="w-56"
                      label="Categoria"
                      name="additional-categories"
                      v-model="i.category"
                    >
                      <UInput v-model="i.category" />
                    </UFormGroup>

                    <UFormGroup
                      class="w-24"
                      label="Limte"
                      name="additional-limit"
                      v-model="i.limit"
                      help="Zero significa ilimitado"
                    >
                      <UInput v-model="i.limit" v-maska data-maska="###" />
                    </UFormGroup>

                    <UButton
                      icon="i-heroicons-trash"
                      color="red"
                      class="rounded-full h-[32px] mt-5"
                      @click="productState.additional.splice(index, 1)"
                    />

                    <UButton
                      icon="i-heroicons-plus"
                      @click="addAdditional(index)"
                      class="rounded-full h-[32px] mt-5"
                    >
                      Adicionais
                    </UButton>
                  </div>
                  <UDivider />
                  <p class="mt-2 mx-3 text-sm font-semibold">Adicionais:</p>
                  <div
                    v-for="(additional, indexAdditional) in i.additional"
                    class="additional"
                  >
                    <UFormGroup
                      class="w-56"
                      label="Nome"
                      name="additional-name"
                      v-model="additional.name"
                    >
                      <UInput v-model="additional.name" />
                    </UFormGroup>

                    <UFormGroup
                      class="w-32"
                      label="Preço"
                      name="additional-value"
                    >
                      <UInput
                        v-model="additional.value"
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
                      @click="
                        productState.additional[index].additional.splice(
                          indexAdditional,
                          1
                        )
                      "
                    />
                  </div>
                </div>
              </div>

              <UButton
                icon="i-heroicons-plus"
                @click="addCategoryAdditional"
                class="mt-5"
              >
                Adicionar Categoria
              </UButton>
            </UFormGroup>
          </div>
          <div class="buttons">
            <UButton color="red" @click="isOpen = false" :loading="isLoading">
              Cancelar
            </UButton>
            <UButton type="submit" :loading="isLoading">Salvar</UButton>
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
.additional-group {
  border: 1px solid #d1d5db;
  border-radius: 7px;
}
.additional-container {
  max-height: 500px;
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
  margin: 5px;
  padding: 5px;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
./services
