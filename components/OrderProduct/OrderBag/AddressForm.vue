<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from "axios";
import { z } from "zod";

const ordersStore = useOrdersStore();

const isModalOpen = ref(false);

const orderSchema = z.object({
  cep: z.string().optional(),
  address: z.string().min(1, "Endereço inválido"),
  address_number: z.string().min(1, "Número inválido"),
  neighborhood: z.string().min(1, "Bairro inválido"),
  city: z.string().min(1, "Cidade inválido"),
  state: z.string().min(1, "Estado inválido"),
  complement: z.string().optional(),
});

function validate() {
  const result = orderSchema.safeParse(ordersStore.orders);
  if (!result.success) {
    return "Adicionar endereço";
  } else {
    return `${ordersStore.orders.address}, ${ordersStore.orders.address_number}`;
  }
}

function onSubmit() {
  isModalOpen.value = false;
}

watch(
  () => ordersStore.orders.cep,
  (value) => {
    if (value?.length === 9) {
      const cep = Number(value.replace("-", ""));
      axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(({ data }) => {
        ordersStore.orders.address = data.logradouro;
        ordersStore.orders.neighborhood = data.bairro;
        ordersStore.orders.city = data.localidade;
        ordersStore.orders.state = data.uf;
      });
    }
  }
);
</script>

<template>
  <UModal v-model="isModalOpen" prevent-close>
    <UCard>
      <template #header>
        <div class="flex justify-between mx-2">
          <p class="title-name">Endereço</p>
          <UButton
            @click="isModalOpen = false"
            color="red"
            class="rounded-full"
            icon="i-heroicons-x-mark"
          />
        </div>
      </template>
      <UForm
        :schema="orderSchema"
        :state="ordersStore.orders"
        @submit="onSubmit"
      >
        <div class="container">
          <UFormGroup label="CEP" name="cep">
            <UInput
              v-model="ordersStore.orders.cep"
              v-maska
              data-maska="#####-###"
            />
          </UFormGroup>

          <UFormGroup label="Endereço" name="address" required>
            <UInput v-model="ordersStore.orders.address" />
          </UFormGroup>

          <UFormGroup label="Número" name="address_number" required>
            <UInput v-model="ordersStore.orders.address_number" />
          </UFormGroup>

          <UFormGroup label="Bairro" name="neighborhood" required>
            <UInput v-model="ordersStore.orders.neighborhood" />
          </UFormGroup>

          <UFormGroup label="Cidade" name="city" required>
            <UInput v-model="ordersStore.orders.city" />
          </UFormGroup>

          <UFormGroup label="Estado" name="state" required>
            <UInput v-model="ordersStore.orders.state" />
          </UFormGroup>

          <UFormGroup label="Complemento" name="complement">
            <UInput v-model="ordersStore.orders.complement" />
          </UFormGroup>

          <UButton type="submit" block size="lg" class="font-semibold">
            Salvar endereço
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>

  <UButton @click="isModalOpen = true" block variant="outline" class="h-12">
    {{ validate() }}
  </UButton>
</template>

<style scoped>
.title-name {
  width: 100%;
  margin-left: 10px;
  font-size: 14pt;
  font-weight: 600;
}
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
