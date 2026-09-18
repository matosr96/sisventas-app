import { computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { PrivateRoutes, Resources } from "../../constants";
import {
  EmptyProductsState, EmptyPurchaseItemState, EmptySuppliersState, ProductStatus, SupplierStatus, type PurchaseItemDto,
} from "../../entities";
import { ProductsApi, PurchasesApi, SuppliersApi } from "../../services";
import { apiErrorMessage } from "../../utils";
import { listResource, safeValue } from "../list-resource";

/** Compra con líneas: el costo lo escribe quien registra (es lo que cobró el proveedor). */
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

  const supplierId = signal<number | null>(null);
  const lines = signal<PurchaseItemDto[]>([{ ...EmptyPurchaseItemState }]);
  const pending = signal(false);
  const total = computed(() => lines().reduce((sum, line) => sum + (line.unitCost ?? 0) * (line.quantity ?? 0), 0));

  const addLine = (): void => lines.update((list) => [...list, { ...EmptyPurchaseItemState }]);
  const removeLine = (index: number): void => lines.update((list) => list.filter((_, i) => i !== index));
  const setLine = (index: number, patch: Partial<PurchaseItemDto>): void =>
    lines.update((list) => list.map((line, i) => (i === index ? { ...line, ...patch } : line)));

  const submit = async (event: Event): Promise<void> => {
    event.preventDefault();
    const items = lines().filter((line) => line.productId != null && (line.quantity ?? 0) > 0 && line.unitCost != null);
    if (supplierId() == null) { toast.error("Elige el proveedor."); return; }
    if (items.length === 0) { toast.error("Añade al menos un producto con cantidad y costo."); return; }
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
    purchasable, activeSuppliers, supplierId, lines, addLine, removeLine, setLine, total, pending, submit,
    isLoading: computed(() => products.isLoading() || suppliers.isLoading()),
  };
}
