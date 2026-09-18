import type { ListState } from "./list-state";

export const PaymentMethod = { CASH: "CASH", CARD: "CARD", TRANSFER: "TRANSFER" } as const;
export type PaymentMethodValue = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface SaleItem {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  quantity: number;
  returnedQuantity: number;
  unitPrice: number;   // congelado al vender: subir el precio no cambia la factura
  subtotal: number;
}

export interface Sale {
  id: number;
  saleNumber: string;
  saleDate: string;
  subtotal: number;
  discount: number;
  taxRate: number;
  tax: number;
  total: number;       // lo calcula el servidor, nunca el cliente
  paymentMethod: PaymentMethodValue;
  amountPaid: number | null;
  changeAmount: number;
  customerName: string | null;
  userId: number;
  userName: string;
  items: SaleItem[];
  createdAt: string;
  updatedAt: string | null;
}

export interface SaleItemDto {
  productId: number | null;
  quantity: number | null;
}

/** El cobro: descuento en dinero, método y, solo en efectivo, lo recibido. */
export interface CheckoutDto {
  discount: number | null;
  paymentMethod: PaymentMethodValue;
  amountPaid: number | null;
  customerName: string;
}

export interface CreateSaleDto extends CheckoutDto {
  saleDate?: string | null;
  items: SaleItemDto[];
}

export interface SaleReturnItem {
  id: number;
  saleItemId: number;
  productId: number;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleReturn {
  id: number;
  returnNumber: string;
  saleId: number;
  saleNumber: string;
  reason: string;
  total: number;
  userId: number;
  items: SaleReturnItem[];
  createdAt: string;
}

export interface SaleReturnItemDto { saleItemId: number; quantity: number; }
export interface CreateSaleReturnDto { reason: string; items: SaleReturnItemDto[]; }

export const EmptySaleItemState: SaleItemDto = { productId: null, quantity: 1 };
export const EmptyCheckoutState: CheckoutDto = { discount: null, paymentMethod: PaymentMethod.CASH, amountPaid: null, customerName: "" };
export const EmptySalesState: ListState<Sale> = { count: 0, page: 0, pages: 0, items: [] };

const PaymentLabels: Record<PaymentMethodValue, string> = { CASH: "Efectivo", CARD: "Tarjeta", TRANSFER: "Transferencia" };
export const paymentMethodLabel = (method: string): string => PaymentLabels[method as PaymentMethodValue] ?? method;
