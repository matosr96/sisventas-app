// Siempre dos decimales: "$ 1.100,50", nunca "$ 1.100,5" ni "$ 22.010".
const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatMoney = (value: number | null | undefined): string =>
  value == null ? "" : money.format(value);

export const formatDate = (value: string | null | undefined): string =>
  value ? new Date(value).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "";

export const formatDateTime = (value: string | null | undefined): string =>
  value
    ? new Date(value).toLocaleString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

/** Convierte lo que llega de un <input type="number"> a number | null sin NaN. */
export const toNumber = (value: unknown): number | null => {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
