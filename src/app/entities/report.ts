import type { PaymentMethodValue } from "./sale";

export interface Summary {
  todaySaleCount: number;
  todayTotal: number;
  yesterdaySaleCount: number;
  yesterdayTotal: number;
  monthPurchaseCount: number;
  monthPurchaseTotal: number;
  activeProductCount: number;
  lowStockCount: number;
  inventoryValue: number;
}

export interface SalesByDay { day: string; count: number; total: number; }
export interface SalesByUser { userId: number; userName: string; count: number; total: number; }
export interface TopProduct { productId: number; sku: string; name: string; quantity: number; total: number; margin: number; }

export interface SalesReport {
  from: string;
  to: string;
  count: number;
  total: number;
  estimatedMargin: number;
  byDay: SalesByDay[];
  byUser: SalesByUser[];
  topProducts: TopProduct[];
}

export interface PaymentBreakdown { paymentMethod: PaymentMethodValue; count: number; total: number; }

export interface CashClosing {
  from: string;
  to: string;
  userId: number | null;
  saleCount: number;
  total: number;
  returned: number;
  net: number;
  byPaymentMethod: PaymentBreakdown[];
}

export const EmptySummaryState: Summary = {
  todaySaleCount: 0, todayTotal: 0, yesterdaySaleCount: 0, yesterdayTotal: 0, monthPurchaseCount: 0,
  monthPurchaseTotal: 0, activeProductCount: 0, lowStockCount: 0, inventoryValue: 0,
};
export const EmptySalesReportState: SalesReport = {
  from: "", to: "", count: 0, total: 0, estimatedMargin: 0, byDay: [], byUser: [], topProducts: [],
};
export const EmptyCashClosingState: CashClosing = {
  from: "", to: "", userId: null, saleCount: 0, total: 0, returned: 0, net: 0, byPaymentMethod: [],
};
