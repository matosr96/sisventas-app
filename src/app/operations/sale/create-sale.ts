import { computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { PrivateRoutes, Resources } from "../../constants";
import { EmptyProductsState, ProductStatus, type Product, type SaleItemDto } from "../../entities";
import { ProductsApi, SalesApi } from "../../services";
import { apiErrorMessage } from "../../utils";
import { catalogPicker } from "../catalog-picker";
import { listResource, safeValue } from "../list-resource";

/** Línea del pedido con el producto resuelto: lo que pinta el panel de la derecha. */
export interface CartLine { product: Product; quantity: number; subtotal: number; }

/**
 * Venta al estilo de una caja: se toca un producto del catálogo y entra al pedido (o suma una
 * unidad si ya estaba). La cantidad se topa con el stock. El precio y el total los pone el
 * servidor; aquí se muestra una estimación con el precio actual para que quien vende sepa qué
 * va a cobrar.
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
  const picker = catalogPicker(sellable);

  const lines = signal<SaleItemDto[]>([]);
  const pending = signal(false);

  const productById = (id: number | null): Product | undefined => sellable().find((product) => product.id === id);
  const cart = computed<CartLine[]>(() =>
    lines().flatMap((line) => {
      const product = productById(line.productId);
      if (!product) return [];
      const quantity = line.quantity ?? 0;
      return [{ product, quantity, subtotal: (product.salePrice ?? 0) * quantity }];
    })
  );
  const itemCount = computed(() => cart().reduce((sum, line) => sum + line.quantity, 0));
  const estimatedTotal = computed(() => cart().reduce((sum, line) => sum + line.subtotal, 0));
  const quantityOf = (productId: number): number => lines().find((line) => line.productId === productId)?.quantity ?? 0;

  const setQuantity = (productId: number, quantity: number | null): void => {
    const product = productById(productId);
    if (!product) return;
    if (quantity == null || quantity <= 0) {
      lines.update((list) => list.filter((line) => line.productId !== productId));
      return;
    }
    if (quantity > product.currentStock) {
      toast.notice(`Solo hay ${product.currentStock} unidades de ${product.name}.`);
      quantity = product.currentStock;
    }
    lines.update((list) => list.map((line) => (line.productId === productId ? { ...line, quantity } : line)));
  };

  const add = (product: Product): void => {
    if (product.currentStock <= 0) { toast.notice(`${product.name} no tiene stock.`); return; }
    const current = quantityOf(product.id);
    if (current === 0) {
      lines.update((list) => [...list, { productId: product.id, quantity: 1 }]);
    } else {
      setQuantity(product.id, current + 1);
    }
  };
  const increment = (productId: number): void => { const product = productById(productId); if (product) add(product); };
  const decrement = (productId: number): void => setQuantity(productId, quantityOf(productId) - 1);
  const remove = (productId: number): void => setQuantity(productId, 0);
  const clear = (): void => lines.set([]);

  /** Enter en la búsqueda: un SKU exacto (o un único candidato) entra al pedido y la búsqueda se limpia. */
  const addFromSearch = (): void => {
    const match = picker.exactMatch();
    if (!match) return;
    add(match);
    picker.searchTerm.set("");
  };

  const submit = async (event: Event): Promise<void> => {
    event.preventDefault();
    const items = lines().filter((line) => line.productId != null && (line.quantity ?? 0) > 0);
    if (items.length === 0) { toast.error("Añade al menos un producto al pedido."); return; }
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

  return {
    ...picker, sellable, cart, itemCount, estimatedTotal, quantityOf,
    add, addFromSearch, increment, decrement, setQuantity, remove, clear,
    pending, submit, isLoading: products.isLoading, isError: computed(() => products.error() != null),
  };
}
