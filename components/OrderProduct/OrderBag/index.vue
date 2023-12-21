<script setup lang="ts">
import AddressForm from "./AddressForm.vue";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import { createOrders, sendWhatsapp } from "./services";

const ordersStore = useOrdersStore();
const toast = useToast();

const isModalOpen = ref(false);

const orderSchema = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  phone: z.string().min(1, { message: "Número do celular obrigatório" }),
  payment_type: z.string().min(1, { message: "Meio de pagamento obrigatório" }),
});

function onSubmit(event: FormSubmitEvent<any>) {
  const { address, address_number, city, isDelivery } = ordersStore.orders;
  if (!isDelivery || (isDelivery && address && address_number && city)) {
    createOrders()
      .then(() => {
        sendWhatsapp();
        toast.add({
          title: "Sucesso",
          description: "Seu pedido foi realizado",
          color: "green",
          timeout: 8000,
          icon: "i-heroicons-check-circle",
        });
      })
      .catch(() => {
        toast.add({
          title: "Erro",
          description: "Erro ao realizar o pedido",
          color: "red",
          timeout: 8000,
          icon: "i-heroicons-x-circle",
        });
      });
  } else {
    toast.add({
      title: "Erro",
      description: "Adicione um endereço",
      color: "red",
      timeout: 8000,
    });
  }
}
</script>

<template>
  <UModal v-model="isModalOpen" prevent-close>
    <UCard>
      <template #header>
        <div class="flex justify-between mx-2">
          <p class="title-name">Seu Pedido</p>
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
          <div class="item">
            <p class="font-semibold">Itens</p>
            <p class="font-semibold">Preço</p>
          </div>
          <div class="item" v-for="products in ordersStore.productsOrders">
            <p>{{ products.productName }}</p>
            <p>{{ convertToMoneyString(products.subtotal) }}</p>
          </div>
          <UButton block variant="soft" @click="isModalOpen = false"
            >Adicionar mais itens</UButton
          >
          <div class="item" v-if="ordersStore.orders.isDelivery">
            <p class="font-semibold text-lg">Taxa de entrega</p>
            <p class="font-semibold text-lg">
              {{ convertToMoneyString(ordersStore.user.delivery_fee) }}
            </p>
          </div>
          <div class="item">
            <p class="font-semibold text-lg">Total</p>
            <p class="font-semibold text-lg">
              {{
                ordersStore.orders.isDelivery
                  ? convertToMoneyString(
                      ordersStore.orders.total + ordersStore.user.delivery_fee
                    )
                  : convertToMoneyString(ordersStore.orders.total)
              }}
            </p>
          </div>
          <p class="font-semibold">Entrega e retirada?</p>
          <div class="flex gap-3 items-center">
            <UToggle v-model="ordersStore.orders.isDelivery" />
            <p>{{ ordersStore.orders.isDelivery ? "Entrega" : "Retirada" }}</p>
          </div>

          <AddressForm />

          <UFormGroup label="Nome Completo" name="name" required>
            <UInput v-model="ordersStore.orders.name" />
          </UFormGroup>

          <UFormGroup label="Número do celular" name="phone" required>
            <UInput
              v-model="ordersStore.orders.phone"
              v-maska
              data-maska="['(##) ####-####', '(##) #####-####']"
            />
          </UFormGroup>
          <UFormGroup label="Meio de pagamento" name="payment_type" required>
            <URadioGroup
              v-model="ordersStore.orders.payment_type"
              :options="[
                {
                  value: 'debit',
                  label: 'Debito',
                },
                {
                  value: 'credit',
                  label: 'Credito',
                },
                {
                  value: 'money',
                  label: 'Dinheiro',
                },
              ]"
            />
          </UFormGroup>
          <UFormGroup
            v-if="ordersStore.orders.payment_type === 'money'"
            label="Troco Para:"
            name="change"
          >
            <UInput
              v-model="ordersStore.orders.change"
              v-maska
              data-maska="0,99"
              data-maska-eager
              data-maska-reversed
              data-maska-tokens="0:\d:multiple|9:\d:optional"
            >
              <template #leading>
                <span>R$</span>
              </template></UInput
            >
          </UFormGroup>
          <UButton type="submit" block size="lg" class="font-semibold"
            >Enviar Pedido</UButton
          >
        </div>
      </UForm>
    </UCard>
  </UModal>

  <div class="bag">
    <div class="bag-button" v-if="ordersStore.orders.total > 0">
      <UButton block size="xl" @click="isModalOpen = true">
        Ver carrinho {{ convertToMoneyString(ordersStore.orders.total) }}
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.bag {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 5px;
  width: 92vw;
}
.bag-button {
  width: 100%;
  max-width: 700px;
}

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
