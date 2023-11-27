export function convertToMoneyString(value: number | undefined) {
  if (value)
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
}
