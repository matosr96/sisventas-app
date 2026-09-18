// Identifica la entidad en Table/Actions y en la configuración de borrado.
export const ScreenName = {
  PRODUCT: "product",
  CATEGORY: "category",
  SUPPLIER: "supplier",
  PURCHASE: "purchase",
  SALE: "sale",
  USER: "user",
  MOVEMENT: "movement",
  AUDIT: "audit",
} as const;

export type ScreenNameValue = (typeof ScreenName)[keyof typeof ScreenName];
