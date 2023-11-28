<script setup lang="ts">
import { convertToMoneyString } from "~/utils/convertToMoneyString";

type ProductsType = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  price: number;
  additional: {
    name: string;
    value: number;
    count: number;
  }[];
  user_id: number;
};

type PropsType = {
  products: ProductsType[];
};

const props = defineProps<PropsType>();
const isOpenModal = ref(false);
const selectedProduct = ref<ProductsType | null>(null);

const { addProduct } = useOrdersStore();
</script>

<template>
  <div
    v-for="product in props?.products"
    class="product"
    @click="
      selectedProduct = {
        ...product,
        additional: product.additional.map((item) => {
          return {
            ...item,
            count: 0,
          };
        }),
      };
      isOpenModal = true;
    "
  >
    <UDivider class="my-4" />
    <p class="font-semibold">{{ product?.name }}</p>
    <div class="flex mt-4">
      <div class="flex flex-col w-2/3">
        <p class="product-description">
          {{ product?.description }}
        </p>
        <p class="text-sm'">
          {{ convertToMoneyString(product?.price) }}
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
    <UModal v-model="isOpenModal" prevent-close>
      <UCard class="modal-card">
        <template #header>
          <div class="flex">
            <p class="product-name">
              {{ selectedProduct?.name }}
            </p>
            <UButton
              @click="isOpenModal = false"
              color="red"
              class="rounded-full"
              icon="i-heroicons-x-mark"
            />
          </div>
        </template>

        <div class="modal-content">
          <img
            class="rounded-xl h-60"
            :src="selectedProduct?.image_url"
            alt="Imagem do produto"
          />
          <p class="mt-10">{{ selectedProduct?.description }}</p>
          <p class="self-start mt-5">
            {{ convertToMoneyString(selectedProduct?.price) }}
          </p>
          <div class="w-full" v-for="additional in selectedProduct?.additional">
            <UDivider class="my-2" />
            <div class="flex justify-between w-full px-5 py-4">
              <div>
                <p class="font-bold">{{ additional.name }}</p>
                <p>{{ convertToMoneyString(additional.value) }}</p>
              </div>
              <div class="additional-count">
                <UButton
                  v-if="additional.count > 0"
                  class="rounded-full"
                  icon="i-heroicons-minus"
                  color="red"
                  variant="ghost"
                  @click="
                    () => {
                      additional.count--;
                    }
                  "
                />
                {{ additional.count }}
                <UButton
                  class="rounded-full"
                  icon="i-heroicons-plus"
                  variant="ghost"
                  @click="
                    () => {
                      additional.count++;
                    }
                  "
                />
              </div>
            </div>
          </div>
          <UTextarea class="w-full" placeholder="Observações" />
          <div class="add-button">
            <UButton
              size="xl"
              block
              @click="
                addProduct({
                  productId: selectedProduct?.id || 0,
                  productName: selectedProduct?.name || '',
                  price: selectedProduct?.price || 0,
                  subtotal: 0,
                  additional: selectedProduct?.additional || [],
                });
                isOpenModal = false;
              "
            >
              Adicionar {{ convertToMoneyString(selectedProduct?.price) }}
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.product-name {
  width: 100%;
  margin-left: 10px;
  font-size: 14pt;
  font-weight: 600;
}

.modal-card {
  height: 100vh;
  margin-bottom: 40px;
}

.modal-content {
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.product-description {
  overflow: hidden;
  margin: 0.75rem;
  margin-left: 0;
  width: 100%;
  height: 6rem;
  font-size: 0.75rem;
  line-height: 1rem;
  text-overflow: ellipsis;
}

.add-button {
  width: 100vw;
  position: fixed;
  bottom: 0px;
}

.add-button button {
  border-radius: 0;
  height: 60px;
}

.additional-count {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
