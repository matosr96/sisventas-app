// El valor ES el recurso de la API: ruta y clave de caché a la vez. Una entrada por entidad.
export const Resources = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  SUPPLIERS: "suppliers",
  PURCHASES: "purchases",
  SALES: "sales",
  USERS: "users",
  MOVEMENTS: "movements",
} as const;

export type Resource = (typeof Resources)[keyof typeof Resources];
