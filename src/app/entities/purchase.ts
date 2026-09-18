import type { ListState } from "./list-state";

export interface PurchaseItem {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  quantity: number;
  unitCost: number;    // congelado al comprar
  subtotal: number;
}

export interface Purchase {
  id: number;
  purchaseNumber: string;
  purchaseDate: string;
  supplierId: number;
  supplierName: string;
  total: number;
  userId: number;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string | null;
}

export interface PurchaseItemDto {
  productId: number | null;
  quantity: number | null;
  unitCost: number | null;   // lo pone quien registra: es lo que cobró el proveedor
}

export interface CreatePurchaseDto {
  supplierId: number | null;
  purchaseDate?: string | null;
  items: PurchaseItemDto[];
}

export const EmptyPurchaseItemState: PurchaseItemDto = { productId: null, quantity: 1, unitCost: null };
export const EmptyPurchaseState: CreatePurchaseDto = {
  supplierId: null, purchaseDate: null, items: [{ ...EmptyPurchaseItemState }],
};
export const EmptyPurchasesState: ListState<Purchase> = { count: 0, page: 0, pages: 0, items: [] };
