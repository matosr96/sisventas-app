import type { ListState } from "./list-state";

export interface SaleItem {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;   // congelado al vender: subir el precio no cambia la factura
  subtotal: number;
}

export interface Sale {
  id: number;
  saleNumber: string;
  saleDate: string;
  total: number;       // lo calcula el servidor, nunca el cliente
  userId: number;
  items: SaleItem[];
  createdAt: string;
  updatedAt: string | null;
}

export interface SaleItemDto {
  productId: number | null;
  quantity: number | null;
}

export interface CreateSaleDto {
  saleDate?: string | null;
  items: SaleItemDto[];
}

export const EmptySaleItemState: SaleItemDto = { productId: null, quantity: 1 };
export const EmptySaleState: CreateSaleDto = { saleDate: null, items: [{ ...EmptySaleItemState }] };
export const EmptySalesState: ListState<Sale> = { count: 0, page: 0, pages: 0, items: [] };
