// Siempre dos decimales: "$ 1.100,50", nunca "$ 1.100,5" ni "$ 22.010". La moneda la fija SettingsStore.
let money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** La API dice en qué moneda factura; el formateador se reconstruye una vez, al cargar la configuración. */
export const setCurrency = (currency: string): void => {
  try {
    money = new Intl.NumberFormat("es-CO", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    /* código desconocido: se mantiene el anterior */
  }
};

export const formatMoney = (value: number | null | undefined): string =>
  value == null ? "" : money.format(value);

export const formatDate = (value: string | null | undefined): string =>
  value ? new Date(value).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "";

export const formatDateTime = (value: string | null | undefined): string =>
  value
    ? new Date(value).toLocaleString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

export const formatPercent = (value: number | null | undefined): string =>
  value == null ? "" : `${value.toLocaleString("es-CO", { maximumFractionDigits: 2 })} %`;

/** Convierte lo que llega de un <input type="number"> a number | null sin NaN. */
export const toNumber = (value: unknown): number | null => {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/** Instante ISO para <input type="datetime-local"> (hora local, sin segundos). */
export const toDateTimeInput = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** Lo inverso: el valor local del input a instante ISO para la API. */
export const fromDateTimeInput = (value: string): string | null => (value ? new Date(value).toISOString() : null);

/** Un rango de días (yyyy-MM-dd) a instantes [inicio del día, fin del día] en hora local. */
export const dayRangeToInstants = (from: string | null, to: string | null): { from: string | null; to: string | null } => ({
  from: from ? new Date(`${from}T00:00:00`).toISOString() : null,
  to: to ? new Date(`${to}T23:59:59.999`).toISOString() : null,
});
