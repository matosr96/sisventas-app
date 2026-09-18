import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyProductsState, EmptyPurchasesState, EmptySalesState, ProductStatus, type Sale } from "../../entities";
import { ProductsApi, PurchasesApi, SalesApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

const DAY = 24 * 60 * 60 * 1000;
const sameDay = (iso: string, day: Date): boolean => new Date(iso).toDateString() === day.toDateString();
const sumOf = (sales: Sale[]): number => sales.reduce((sum, sale) => sum + sale.total, 0);

/** Variación porcentual redondeada; null cuando no hay base con la que comparar. */
const deltaPercent = (current: number, previous: number): number | null =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

/**
 * Cifras de Inicio derivadas de los mismos recursos que usan las pantallas. Cada indicador
 * lleva su periodo (hoy, este mes) y una comparación (ayer): un acumulado sin contexto no dice nada.
 */
export function homeSummary() {
  // inject() solo vale aquí, en el contexto de inyección; nunca dentro de un loader.
  const productsApi = inject(ProductsApi);
  const salesApi = inject(SalesApi);
  const purchasesApi = inject(PurchasesApi);

  const productsRef = listResource(Resources.PRODUCTS, () => productsApi.list(), EmptyProductsState);
  const products = safeValue(productsRef, EmptyProductsState);
  const salesRef = listResource(Resources.SALES, () => salesApi.list(), EmptySalesState);
  const sales = safeValue(salesRef, EmptySalesState);
  const purchasesRef = listResource(Resources.PURCHASES, () => purchasesApi.list(), EmptyPurchasesState);
  const purchases = safeValue(purchasesRef, EmptyPurchasesState);

  const today = new Date();
  const yesterday = new Date(today.getTime() - DAY);
  const todaySales = computed(() => sales().items.filter((sale) => sameDay(sale.saleDate, today)));
  const yesterdaySales = computed(() => sales().items.filter((sale) => sameDay(sale.saleDate, yesterday)));
  const monthPurchases = computed(() =>
    purchases().items.filter((purchase) => {
      const date = new Date(purchase.purchaseDate);
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    })
  );
  const lowStock = computed(() =>
    products().items.filter((product) =>
      product.status === ProductStatus.ACTIVE && product.lowStock != null && product.currentStock <= product.lowStock
    )
  );

  return {
    isLoading: computed(() => productsRef.isLoading() || salesRef.isLoading() || purchasesRef.isLoading()),
    isError: computed(() => productsRef.error() != null || salesRef.error() != null || purchasesRef.error() != null),
    todayCount: computed(() => todaySales().length),
    yesterdayCount: computed(() => yesterdaySales().length),
    todayTotal: computed(() => sumOf(todaySales())),
    todayDelta: computed(() => deltaPercent(sumOf(todaySales()), sumOf(yesterdaySales()))),
    monthPurchaseCount: computed(() => monthPurchases().length),
    monthPurchaseTotal: computed(() => monthPurchases().reduce((sum, purchase) => sum + purchase.total, 0)),
    activeProductCount: computed(() => products().items.filter((product) => product.status === ProductStatus.ACTIVE).length),
    lowStock,
    recentSales: computed(() => sales().items.slice(0, 6)),
  };
}
