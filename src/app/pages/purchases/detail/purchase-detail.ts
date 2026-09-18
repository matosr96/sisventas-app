import { Component, computed, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, HeaderPage, Skeleton } from "../../../components/shared";
import { PrivateRoutes, ScreenName } from "../../../constants";
import { deleteItem } from "../../../operations/delete-item";
import { getPurchase } from "../../../operations/purchase/get-purchase";
import { AuthStore } from "../../../store/auth";
import { formatDateTime, formatMoney } from "../../../utils";

@Component({
  selector: "app-purchase-detail",
  imports: [Layout, HeaderPage, Skeleton, ButtonCnt, RouterLink],
  templateUrl: "./purchase-detail.html",
  styleUrl: "./purchase-detail.css",
})
export class PurchaseDetail {
  readonly id = input.required<string>();
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly detail = getPurchase(computed(() => Number(this.id())));
  private readonly remover = deleteItem();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;
  readonly units = computed(() => this.detail.purchase()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0);

  voidPurchase(): void {
    this.remover.remove(ScreenName.PURCHASE, Number(this.id()));
    void this.router.navigate([PrivateRoutes.PURCHASES]);
  }
}
