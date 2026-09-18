import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductTile } from "../../../components/container";
import { Layout } from "../../../components/layout/layout";
import {
  ButtonCnt, FilterChips, HeaderPage, InputCnt, Modal, NumberInput, SelectCpt, Skeleton, type FilterOption, type SelectOption,
} from "../../../components/shared";
import { PrivateRoutes } from "../../../constants";
import { PaymentMethod, type PaymentMethodValue } from "../../../entities";
import { createSale } from "../../../operations/sale/create-sale";
import { formatMoney, formatPercent } from "../../../utils";

/** Caja: catálogo en baldosas a la izquierda, pedido fijo a la derecha. Tocar un producto lo añade; "Cobrar" abre el paso de pago. */
@Component({
  selector: "app-new-sale",
  imports: [Layout, HeaderPage, Skeleton, ProductTile, FilterChips, ButtonCnt, RouterLink, Modal, InputCnt, NumberInput, SelectCpt],
  templateUrl: "./new-sale.html",
  styleUrl: "./new-sale.css",
})
export class NewSale {
  readonly op = createSale();
  readonly routes = PrivateRoutes;
  readonly cash = PaymentMethod.CASH;
  readonly formatMoney = formatMoney;
  readonly formatPercent = formatPercent;
  readonly categoryOptions = computed<FilterOption[]>(() =>
    this.op.categories().map((category) => ({ value: String(category.id), label: category.name }))
  );
  readonly paymentOptions: SelectOption<PaymentMethodValue>[] = [
    { value: PaymentMethod.CASH, label: "Efectivo" }, { value: PaymentMethod.CARD, label: "Tarjeta" }, { value: PaymentMethod.TRANSFER, label: "Transferencia" },
  ];
  /** Billetes habituales para cobrar sin teclear: el primero que cubre el total y los siguientes. */
  readonly quickAmounts = computed(() => {
    const total = this.op.estimatedTotal();
    const steps = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
    const exact = Math.ceil(total);
    const rounded = steps.map((step) => Math.ceil(total / step) * step).filter((value, i, all) => value > total && all.indexOf(value) === i);
    return [exact, ...rounded].slice(0, 4);
  });

  onSearch(event: Event): void { this.op.searchTerm.set((event.target as HTMLInputElement).value); }
  onSearchEnter(event: Event): void { event.preventDefault(); this.op.addFromSearch(); }
  onQuantity(productId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.op.setQuantity(productId, raw === "" ? null : Number(raw));
  }
}
