import type { ListState } from "./list-state";

export const StockMovementType = {
  INITIAL: "INITIAL", PURCHASE: "PURCHASE", PURCHASE_VOID: "PURCHASE_VOID",
  SALE: "SALE", SALE_VOID: "SALE_VOID", ADJUSTMENT: "ADJUSTMENT",
} as const;
export type StockMovementTypeValue = (typeof StockMovementType)[keyof typeof StockMovementType];

export interface StockMovement {
  id: number;
  productId: number;
  type: StockMovementTypeValue;
  quantity: number;      // con signo: positivo entra, negativo sale
  stockAfter: number;
  reference: string | null;
  reason: string | null;
  userId: number;
  createdAt: string;
}

export interface AdjustStockDto {
  quantity: number | null;
  reason: string;
}

export const EmptyAdjustmentState: AdjustStockDto = { quantity: null, reason: "" };
export const EmptyMovementsState: ListState<StockMovement> = { count: 0, page: 0, pages: 0, items: [] };

const MovementLabels: Record<StockMovementTypeValue, string> = {
  INITIAL: "Stock inicial", PURCHASE: "Compra", PURCHASE_VOID: "Compra anulada",
  SALE: "Venta", SALE_VOID: "Venta anulada", ADJUSTMENT: "Ajuste",
};
export const movementTypeLabel = (type: StockMovementTypeValue): string => MovementLabels[type] ?? type;
