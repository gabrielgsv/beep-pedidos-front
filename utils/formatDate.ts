export function formatDate(data: Date): string {
  data = new Date(data);
  const opcoes: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const formatador: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    "pt-BR",
    opcoes
  );
  return formatador.format(data);
}
