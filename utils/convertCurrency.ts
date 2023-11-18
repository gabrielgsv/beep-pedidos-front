export default function convertCurrency(value: number) {
  return value
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace("R$", "")
    .replace(".", "");
}
