// El valor ES el recurso de la API: ruta y clave de caché a la vez. Una entrada por entidad.
export const Resources = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  SUPPLIERS: "suppliers",
  PURCHASES: "purchases",
  SALES: "sales",
  RETURNS: "returns",
  USERS: "users",
  MOVEMENTS: "movements",
  AUDITS: "audits",
  REPORTS: "reports",
  SETTINGS: "settings",
} as const;

export type Resource = (typeof Resources)[keyof typeof Resources];
