import { computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { PrivateRoutes, Resources } from "../../constants";
import { EmptyCheckoutState, PaymentMethod, type CheckoutDto, type Product, type SaleItemDto } from "../../entities";
import { SalesApi } from "../../services";
import { SettingsStore } from "../../store/settings";
import { apiErrorMessage, apiErrorCode } from "../../utils";
import { catalogPicker } from "../catalog-picker";

/** Línea del pedido con el producto resuelto: lo que pinta el panel de la derecha. */
export interface CartLine { product: Product; quantity: number; subtotal: number; rejected: boolean; }

/**
 * Venta al estilo de una caja: se toca un producto del catálogo y entra al pedido (o suma una
 * unidad si ya estaba). La cantidad se topa con el stock. El cobro es un paso aparte (descuento,
 * método de pago, efectivo recibido); el subtotal, el impuesto, el total y el cambio los calcula
 * el servidor: aquí se muestra una estimación con la tasa de la configuración.
 */
export function createSale() {
  const salesApi = inject(SalesApi);
  const queryClient = inject(QueryClient);
  const settings = inject(SettingsStore);
  const toast = inject(Toast);
  const router = inject(Router);
  const picker = catalogPicker();

  const lines = signal<SaleItemDto[]>([]);
  const products = signal<Map<number, Product>>(new Map());
  const rejectedIds = signal<Set<number>>(new Set());
  const checkout = signal<CheckoutDto>({ ...EmptyCheckoutState });
  const checkingOut = signal(false);
  const pending = signal(false);

  const productById = (id: number | null): Product | undefined => (id == null ? undefined : products().get(id));
  const cart = computed<CartLine[]>(() =>
    lines().flatMap((line) => {
      const product = productById(line.productId);
      if (!product) return [];
      const quantity = line.quantity ?? 0;
      return [{ product, quantity, subtotal: (product.salePrice ?? 0) * quantity, rejected: rejectedIds().has(product.id) }];
    })
  );
  const itemCount = computed(() => cart().reduce((sum, line) => sum + line.quantity, 0));
  const subtotal = computed(() => cart().reduce((sum, line) => sum + line.subtotal, 0));
  const discount = computed(() => Math.min(subtotal(), Math.max(0, checkout().discount ?? 0)));
  const tax = computed(() => Math.round((subtotal() - discount()) * settings.taxRate()) / 100);
  const estimatedTotal = computed(() => subtotal() - discount() + tax());
  const change = computed(() => {
    const paid = checkout().amountPaid;
    return checkout().paymentMethod === PaymentMethod.CASH && paid != null ? paid - estimatedTotal() : 0;
  });
  const canConfirm = computed(() =>
    cart().length > 0 && (checkout().paymentMethod !== PaymentMethod.CASH || checkout().amountPaid == null || change() >= 0)
  );
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
    products.update((map) => new Map(map).set(product.id, product));
    rejectedIds.update((set) => { const next = new Set(set); next.delete(product.id); return next; });
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
  const clear = (): void => { lines.set([]); rejectedIds.set(new Set()); checkout.set({ ...EmptyCheckoutState }); };

  /** Enter en la búsqueda: un SKU exacto (o un único candidato) entra al pedido y la búsqueda se limpia. */
  const addFromSearch = (): void => {
    const match = picker.exactMatch();
    if (!match) return;
    add(match);
    picker.searchTerm.set("");
  };

  const setCheckout = (patch: Partial<CheckoutDto>): void => checkout.update((current) => ({ ...current, ...patch }));
  const openCheckout = (): void => {
    if (cart().length === 0) { toast.error("Añade al menos un producto al pedido."); return; }
    checkingOut.set(true);
  };
  const closeCheckout = (): void => checkingOut.set(false);

  const submit = async (event: Event): Promise<void> => {
    event.preventDefault();
    if (pending() || !canConfirm()) return;
    const items = lines().filter((line) => line.productId != null && (line.quantity ?? 0) > 0);
    pending.set(true);
    try {
      const info = checkout();
      const sale = await salesApi.create({
        items,
        discount: info.discount,
        paymentMethod: info.paymentMethod,
        amountPaid: info.paymentMethod === PaymentMethod.CASH ? info.amountPaid : null,
        customerName: info.customerName.trim(),
      });
      queryClient.invalidate(Resources.SALES, Resources.PRODUCTS, Resources.REPORTS);
      toast.success(`Venta ${sale.saleNumber} registrada.`);
      clear();
      await router.navigate([PrivateRoutes.SALES, sale.id], { state: { justCreated: true } });
    } catch (error) {
      // Sin stock (621): otro vendedor se adelantó. Se marca la línea y se refresca el catálogo.
      if (apiErrorCode(error) === "621") {
        rejectedIds.set(new Set(cart().filter((line) => line.quantity > line.product.currentStock).map((line) => line.product.id)));
        queryClient.invalidate(Resources.PRODUCTS);
        checkingOut.set(false);
      }
      toast.error(apiErrorMessage(error));
    } finally {
      pending.set(false);
    }
  };

  return {
    ...picker, cart, itemCount, subtotal, discount, tax, estimatedTotal, change, canConfirm, quantityOf,
    taxRate: settings.taxRate, checkout, setCheckout, checkingOut, openCheckout, closeCheckout,
    add, addFromSearch, increment, decrement, setQuantity, remove, clear, pending, submit,
  };
}
