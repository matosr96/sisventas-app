import { computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { PrivateRoutes, Resources } from "../../constants";
import {
  EmptyProductsState, EmptySuppliersState, ProductStatus, SupplierStatus, type Product, type PurchaseItemDto,
} from "../../entities";
import { ProductsApi, PurchasesApi, SuppliersApi } from "../../services";
import { apiErrorMessage } from "../../utils";
import { catalogPicker } from "../catalog-picker";
import { listResource, safeValue } from "../list-resource";

/** Línea de la compra con el producto resuelto. El costo lo escribe quien registra. */
export interface PurchaseLine { product: Product; quantity: number; unitCost: number | null; subtotal: number; }

/**
 * Compra con el mismo gesto que la venta: se toca el producto y entra a la orden con el último
 * costo conocido precargado; la cantidad y el costo se corrigen en el panel. Sin tope de stock:
 * comprar suma.
 */
export function createPurchase() {
  const purchasesApi = inject(PurchasesApi);
  const productsApi = inject(ProductsApi);
  const suppliersApi = inject(SuppliersApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const router = inject(Router);

  const products = listResource(Resources.PRODUCTS, () => productsApi.list(), EmptyProductsState);
  const suppliers = listResource(Resources.SUPPLIERS, () => suppliersApi.list(), EmptySuppliersState);
  const catalog = safeValue(products, EmptyProductsState);
  const supplierList = safeValue(suppliers, EmptySuppliersState);
  const purchasable = computed(() => catalog().items.filter((product) => product.status === ProductStatus.ACTIVE));
  const activeSuppliers = computed(() => supplierList().items.filter((supplier) => supplier.status === SupplierStatus.ACTIVE));
  const picker = catalogPicker(purchasable);

  const supplierId = signal<number | null>(null);
  const lines = signal<PurchaseItemDto[]>([]);
  const pending = signal(false);

  const productById = (id: number | null): Product | undefined => purchasable().find((product) => product.id === id);
  const cart = computed<PurchaseLine[]>(() =>
    lines().flatMap((line) => {
      const product = productById(line.productId);
      if (!product) return [];
      const quantity = line.quantity ?? 0;
      return [{ product, quantity, unitCost: line.unitCost, subtotal: (line.unitCost ?? 0) * quantity }];
    })
  );
  const itemCount = computed(() => cart().reduce((sum, line) => sum + line.quantity, 0));
  const total = computed(() => cart().reduce((sum, line) => sum + line.subtotal, 0));
  const quantityOf = (productId: number): number => lines().find((line) => line.productId === productId)?.quantity ?? 0;

  const patch = (productId: number, changes: Partial<PurchaseItemDto>): void =>
    lines.update((list) => list.map((line) => (line.productId === productId ? { ...line, ...changes } : line)));
  const setQuantity = (productId: number, quantity: number | null): void => {
    if (quantity == null || quantity <= 0) { lines.update((list) => list.filter((line) => line.productId !== productId)); return; }
    patch(productId, { quantity });
  };
  const setUnitCost = (productId: number, unitCost: number | null): void => patch(productId, { unitCost });

  const add = (product: Product): void => {
    const current = quantityOf(product.id);
    if (current === 0) {
      lines.update((list) => [...list, { productId: product.id, quantity: 1, unitCost: product.purchasePrice }]);
    } else {
      setQuantity(product.id, current + 1);
    }
  };
  const increment = (productId: number): void => { const product = productById(productId); if (product) add(product); };
  const decrement = (productId: number): void => setQuantity(productId, quantityOf(productId) - 1);
  const remove = (productId: number): void => setQuantity(productId, 0);
  const clear = (): void => lines.set([]);
  const addFromSearch = (): void => {
    const match = picker.exactMatch();
    if (!match) return;
    add(match);
    picker.searchTerm.set("");
  };

  const submit = async (event: Event): Promise<void> => {
    event.preventDefault();
    const items = lines().filter((line) => line.productId != null && (line.quantity ?? 0) > 0 && line.unitCost != null);
    if (supplierId() == null) { toast.error("Elige el proveedor."); return; }
    if (items.length === 0) { toast.error("Añade al menos un producto con cantidad y costo."); return; }
    if (items.length < lines().length) { toast.error("Todas las líneas necesitan un costo unitario."); return; }
    pending.set(true);
    try {
      const purchase = await purchasesApi.create({ supplierId: supplierId(), items });
      queryClient.invalidate(Resources.PURCHASES, Resources.PRODUCTS);
      toast.success(`Compra ${purchase.purchaseNumber} registrada.`);
      await router.navigate([PrivateRoutes.PURCHASES, purchase.id]);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      pending.set(false);
    }
  };

  return {
    ...picker, purchasable, activeSuppliers, supplierId, cart, itemCount, total, quantityOf,
    add, addFromSearch, increment, decrement, setQuantity, setUnitCost, remove, clear, pending, submit,
    isLoading: computed(() => products.isLoading() || suppliers.isLoading()),
    isError: computed(() => products.error() != null || suppliers.error() != null),
  };
}
