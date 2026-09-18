import type { ListState } from "./list-state";

export const ProductStatus = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" } as const;
export type ProductStatusValue = (typeof ProductStatus)[keyof typeof ProductStatus];

export interface Product {
  id: number;
  sku: string;
  name: string;
  purchasePrice: number | null;  // último costo pagado; lo actualiza cada compra
  salePrice: number | null;
  currentStock: number;
  initialStock: number | null;
  status: ProductStatusValue;
  image: string | null;
  lowStock: number | null;
  categoryId: number | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string | null;
}

/** Alta: el stock entra por initialStock y queda como asiento INITIAL del libro. */
export interface CreateProductDto {
  sku: string;
  name: string;
  purchasePrice: number | null;
  salePrice: number | null;
  initialStock: number | null;
  status: ProductStatusValue | null;   // null = ACTIVE
  image: string;
  lowStock: number | null;
  categoryId: number | null;
}

/** Edición: el stock NO se edita aquí; solo se mueve por compra, venta, anulación o ajuste. */
export type UpdateProductDto = Omit<CreateProductDto, "initialStock">;

/** Sin undefined ni null en textos: los formularios nacen con "" y los numéricos con null. */
export const EmptyProductState: CreateProductDto = {
  sku: "", name: "", purchasePrice: null, salePrice: null, initialStock: null, status: null, image: "", lowStock: null, categoryId: null,
};

export const EmptyProductsState: ListState<Product> = { count: 0, page: 0, pages: 0, items: [] };

export const productStatusLabel = (status: string): string =>
  status === ProductStatus.INACTIVE ? "Retirado" : "Activo";
