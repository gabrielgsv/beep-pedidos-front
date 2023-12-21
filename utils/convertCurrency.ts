export default function convertCurrency(valueProps: number) {
  const value = valueProps ? valueProps : 0;
  return value
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace("R$", "")
    .replace(".", "");
}
