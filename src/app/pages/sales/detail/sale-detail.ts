import { Component, computed, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, HeaderPage, Loader } from "../../../components/shared";
import { PrivateRoutes, ScreenName } from "../../../constants";
import { deleteItem } from "../../../operations/delete-item";
import { downloadSalePdf } from "../../../operations/sale/download-sale-pdf";
import { getSale } from "../../../operations/sale/get-sale";
import { AuthStore } from "../../../store/auth";
import { formatDateTime, formatMoney } from "../../../utils";

@Component({
  selector: "app-sale-detail",
  imports: [Layout, HeaderPage, Loader, ButtonCnt, RouterLink],
  templateUrl: "./sale-detail.html",
  styleUrl: "./sale-detail.css",
})
export class SaleDetail {
  readonly id = input.required<string>();
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly saleId = computed(() => Number(this.id()));
  readonly detail = getSale(this.saleId);
  readonly pdf = downloadSalePdf();
  private readonly remover = deleteItem();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;

  voidSale(): void {
    this.remover.remove(ScreenName.SALE, this.saleId());
    void this.router.navigate([PrivateRoutes.SALES]);
  }
}
