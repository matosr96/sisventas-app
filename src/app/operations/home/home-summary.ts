import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyProductsState, EmptyPurchasesState, EmptySalesState, ProductStatus } from "../../entities";
import { ProductsApi, PurchasesApi, SalesApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

/** Cifras de Inicio derivadas de los mismos recursos que usan las pantallas. */
export function homeSummary() {
  // inject() solo vale aquí, en el contexto de inyección; nunca dentro de un loader.
  const productsApi = inject(ProductsApi);
  const salesApi = inject(SalesApi);
  const purchasesApi = inject(PurchasesApi);

  const products = safeValue(listResource(Resources.PRODUCTS, () => productsApi.list(), EmptyProductsState), EmptyProductsState);
  const salesRef = listResource(Resources.SALES, () => salesApi.list(), EmptySalesState);
  const sales = safeValue(salesRef, EmptySalesState);
  const purchasesRef = listResource(Resources.PURCHASES, () => purchasesApi.list(), EmptyPurchasesState);
  const purchases = safeValue(purchasesRef, EmptyPurchasesState);

  return {
    isLoading: computed(() => salesRef.isLoading() || purchasesRef.isLoading()),
    productCount: computed(() => products().count),
    saleCount: computed(() => sales().count),
    purchaseCount: computed(() => purchases().count),
    salesTotal: computed(() => sales().items.reduce((sum, sale) => sum + sale.total, 0)),
    lowStock: computed(() =>
      products().items.filter((product) =>
        product.status === ProductStatus.ACTIVE && product.lowStock != null && product.currentStock <= product.lowStock
      )
    ),
    recentSales: computed(() => sales().items.slice(0, 5)),
  };
}
