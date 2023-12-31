<script setup lang="ts">
import { convertToMoneyString } from "~/utils/convertToMoneyString";

type ProductsType = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  price: number;
  additional: {
    category: string;
    limit: number;
    additional: {
      name: string;
      value: any;
      count: number;
    }[];
  }[];
  user_id: number;
};

type PropsType = {
  products: ProductsType[];
};

const props = defineProps<PropsType>();
const isOpenModal = ref(false);
const selectedProduct = ref<ProductsType>({
  id: 0,
  name: "",
  image_url: "",
  description: "",
  price: 0,
  additional: [],
  user_id: 0,
});

const { addProduct } = useOrdersStore();
const subtotal = ref(0);

watch(
  () => selectedProduct.value?.price,
  () => {
    subtotal.value = selectedProduct.value?.price || 0;
  }
);

type CategoriesType = {
  category: string;
  limit: number;
  additional: {
    name: string;
    value: any;
    count: number;
  }[];
};
const compareCategoryLimit = computed(() => (categories: CategoriesType) => {
  if (categories.limit === 0) return false;

  const isOverLimit: boolean =
    categories.additional.reduce((total, item) => total + item.count, 0) >=
    categories.limit;
  return isOverLimit;
});

function addAdditionalToSubTotal() {
  const basePrice = selectedProduct.value?.price || 0;
  subtotal.value = basePrice;
  let additionalPrice = 0;
  selectedProduct.value?.additional.forEach((additional) => {
    additional.additional.forEach((item) => {
      additionalPrice += item.value * item.count;
    });
  });
  subtotal.value += additionalPrice;
}
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
          v-if="product?.image_url && product.image_url.length > 0"
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
              class="rounded-full w-8 h-8"
              icon="i-heroicons-x-mark"
            />
          </div>
        </template>

        <div class="modal-content">
          <img
            v-if="
              selectedProduct?.image_url && selectedProduct.image_url.length > 0
            "
            class="rounded-xl h-40"
            :src="selectedProduct?.image_url"
            alt="Imagem do produto"
          />
          <p class="mt-10">{{ selectedProduct?.description }}</p>
          <p class="self-start mt-5">
            {{ convertToMoneyString(selectedProduct?.price) }}
          </p>
          <div class="w-full" v-for="categories in selectedProduct?.additional">
            <UDivider class="my-2" />
            <p class="font-semibold">
              {{ categories.category }}
              <span class="text-sm font-normal">
                -
                {{
                  categories.limit > 0 ? `Escolha até: ${categories.limit}` : ""
                }}</span
              >
            </p>
            <div
              v-for="additional in categories.additional"
              class="flex justify-between w-full px-5 py-4"
            >
              <div>
                <p>{{ additional.name }}</p>
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
                      if (additional?.count) {
                        additional.count--;
                      } else {
                        additional.count = 0;
                      }
                      addAdditionalToSubTotal();
                    }
                  "
                />
                {{ additional.count }}
                <div class="w-4">
                  <UButton
                    v-if="!additional.count || additional.count === 0"
                    class="rounded-full"
                    icon="i-heroicons-plus"
                    variant="ghost"
                    :disabled="compareCategoryLimit(categories)"
                    :color="compareCategoryLimit(categories) ? 'gray' : 'green'"
                    @click="
                      () => {
                        if (additional?.count) {
                          additional.count++;
                        } else {
                          additional.count = 1;
                        }
                        addAdditionalToSubTotal();
                      }
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
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
          Adicionar {{ convertToMoneyString(subtotal) }}
        </UButton>
      </div>
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
  border: none;
  box-shadow: none;
  height: 75vh;
  overflow-y: auto;
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
  width: 100%;
  /* position: fixed; */
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
