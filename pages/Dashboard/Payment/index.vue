<script setup lang="ts">
function handleClickPay() {
  api()
    .post("/payment/create-checkout-session")
    .then(({ data }) => {
      window.location.href = data?.url;
    })
    .catch((error) => {
      console.error(error);
    });
}
</script>

<template>
  <div>
    <h1>Pagamento</h1>
    <UButton @click="handleClickPay()">Pagar mensalidade de R$49,90</UButton>
  </div>
</template>

<style lang="css" scoped></style>
