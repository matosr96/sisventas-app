/** Configuración pública del negocio que expone la API. */
export interface Settings {
  businessName: string;
  currency: string;
  taxRate: number;
}

export const EmptySettingsState: Settings = { businessName: "SisVentas", currency: "COP", taxRate: 0 };
