import { computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { PrivateRoutes, Resources } from "../../constants";
import { EmptyProductsState, EmptySaleItemState, ProductStatus, type Product, type SaleItemDto } from "../../entities";
import { ProductsApi, SalesApi } from "../../services";
import { apiErrorMessage } from "../../utils";
import { listResource, safeValue } from "../list-resource";

/**
 * Venta con líneas. El precio y el total los pone el servidor; aquí solo se muestra una
 * estimación con el precio actual del catálogo para que quien vende sepa qué va a cobrar.
 */
export function createSale() {
  const salesApi = inject(SalesApi);
  const productsApi = inject(ProductsApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const router = inject(Router);

  const products = listResource(Resources.PRODUCTS, () => productsApi.list(), EmptyProductsState);
  const catalog = safeValue(products, EmptyProductsState);
  const sellable = computed(() => catalog().items.filter((product) => product.status === ProductStatus.ACTIVE));
  const lines = signal<SaleItemDto[]>([{ ...EmptySaleItemState }]);
  const pending = signal(false);

  const productById = (id: number | null): Product | undefined => sellable().find((product) => product.id === id);
  const estimatedTotal = computed(() =>
    lines().reduce((total, line) => total + (productById(line.productId)?.salePrice ?? 0) * (line.quantity ?? 0), 0)
  );

  const addLine = (): void => lines.update((list) => [...list, { ...EmptySaleItemState }]);
  const removeLine = (index: number): void => lines.update((list) => list.filter((_, i) => i !== index));
  const setLine = (index: number, patch: Partial<SaleItemDto>): void =>
    lines.update((list) => list.map((line, i) => (i === index ? { ...line, ...patch } : line)));

  const submit = async (event: Event): Promise<void> => {
    event.preventDefault();
    const items = lines().filter((line) => line.productId != null && (line.quantity ?? 0) > 0);
    if (items.length === 0) { toast.error("Añade al menos un producto con cantidad."); return; }
    pending.set(true);
    try {
      const sale = await salesApi.create({ items });
      queryClient.invalidate(Resources.SALES, Resources.PRODUCTS);
      toast.success(`Venta ${sale.saleNumber} registrada.`);
      await router.navigate([PrivateRoutes.SALES, sale.id]);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      pending.set(false);
    }
  };

  return { sellable, lines, addLine, removeLine, setLine, productById, estimatedTotal, pending, submit, isLoading: products.isLoading };
}
