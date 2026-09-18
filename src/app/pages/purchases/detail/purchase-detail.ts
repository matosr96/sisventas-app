import { Component, computed, inject, input, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, HeaderPage, Modal, Skeleton } from "../../../components/shared";
import { PrivateRoutes, ScreenName } from "../../../constants";
import { deleteItem } from "../../../operations/delete-item";
import { getPurchase } from "../../../operations/purchase/get-purchase";
import { updatePurchaseDate } from "../../../operations/purchase/update-purchase-date";
import { AuthStore } from "../../../store/auth";
import { formatDateTime, formatMoney, toDateTimeInput } from "../../../utils";

@Component({
  selector: "app-purchase-detail",
  imports: [Layout, HeaderPage, Skeleton, ButtonCnt, Modal, RouterLink],
  templateUrl: "./purchase-detail.html",
  styleUrl: "./purchase-detail.css",
})
export class PurchaseDetail {
  readonly id = input.required<string>();
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly purchaseId = computed(() => Number(this.id()));
  readonly detail = getPurchase(this.purchaseId);
  readonly dateEditor = updatePurchaseDate(() => this.purchaseId());
  private readonly remover = deleteItem();
  readonly editingDate = signal(false);
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;
  readonly units = computed(() => this.detail.purchase()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0);

  openDateEditor(): void {
    this.dateEditor.value.set(toDateTimeInput(this.detail.purchase()?.purchaseDate));
    this.editingDate.set(true);
  }
  async saveDate(event: Event): Promise<void> { if (await this.dateEditor.submit(event)) this.editingDate.set(false); }

  async voidPurchase(): Promise<void> {
    if (await this.remover.remove(ScreenName.PURCHASE, this.purchaseId())) void this.router.navigate([PrivateRoutes.PURCHASES]);
  }
}
