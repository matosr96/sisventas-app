import { Component, computed, inject, input, signal, type OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Layout } from "../../../components/layout/layout";
import { Badge, ButtonCnt, HeaderPage, InputCnt, Modal, Skeleton } from "../../../components/shared";
import { PrivateRoutes, ScreenName } from "../../../constants";
import { paymentMethodLabel } from "../../../entities";
import { deleteItem } from "../../../operations/delete-item";
import { downloadSalePdf } from "../../../operations/sale/download-sale-pdf";
import { getSale } from "../../../operations/sale/get-sale";
import { saleReturns } from "../../../operations/sale/sale-returns";
import { updateSaleDate } from "../../../operations/sale/update-sale-date";
import { AuthStore } from "../../../store/auth";
import { formatDateTime, formatMoney, formatPercent, toDateTimeInput } from "../../../utils";

@Component({
  selector: "app-sale-detail",
  imports: [Layout, HeaderPage, Skeleton, ButtonCnt, Badge, Modal, InputCnt, RouterLink],
  templateUrl: "./sale-detail.html",
  styleUrl: "./sale-detail.css",
})
export class SaleDetail implements OnInit {
  readonly id = input.required<string>();
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly saleId = computed(() => Number(this.id()));
  readonly detail = getSale(this.saleId);
  readonly returns = saleReturns(this.saleId);
  readonly pdf = downloadSalePdf();
  readonly dateEditor = updateSaleDate(() => this.saleId());
  private readonly remover = deleteItem();
  readonly returning = signal(false);
  readonly editingDate = signal(false);
  readonly justCreated = signal(false);
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;
  readonly formatPercent = formatPercent;
  readonly paymentMethodLabel = paymentMethodLabel;
  readonly units = computed(() => this.detail.sale()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0);
  readonly returnedUnits = computed(() => this.detail.sale()?.items.reduce((sum, item) => sum + item.returnedQuantity, 0) ?? 0);
  readonly canReturn = computed(() => (this.detail.sale()?.items.some((item) => item.returnedQuantity < item.quantity) ?? false));

  /** Recién cobrada desde la caja: se ofrece imprimir la tirilla de inmediato. */
  ngOnInit(): void { this.justCreated.set(Boolean((history.state as { justCreated?: boolean } | null)?.justCreated)); }

  openDateEditor(): void {
    this.dateEditor.value.set(toDateTimeInput(this.detail.sale()?.saleDate));
    this.editingDate.set(true);
  }
  async saveDate(event: Event): Promise<void> { if (await this.dateEditor.submit(event)) this.editingDate.set(false); }
  async saveReturn(event: Event): Promise<void> { if (await this.returns.submit(event)) this.returning.set(false); }
  onReturnQuantity(saleItemId: number, max: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.returns.setQuantity(saleItemId, raw === "" ? null : Number(raw), max);
  }
  onReason(event: Event): void { this.returns.reason.set((event.target as HTMLInputElement).value); }

  /** Solo navega si la anulación se confirmó y la API la aceptó. */
  async voidSale(): Promise<void> {
    if (await this.remover.remove(ScreenName.SALE, this.saleId())) void this.router.navigate([PrivateRoutes.SALES]);
  }
}
