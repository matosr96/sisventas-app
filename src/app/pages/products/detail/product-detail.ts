import { Component, computed, inject, input, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, HeaderPage, InputCnt, Modal, NumberInput, Skeleton } from "../../../components/shared";
import { PrivateRoutes } from "../../../constants";
import { movementTypeLabel, productStatusLabel } from "../../../entities";
import { adjustStock } from "../../../operations/inventory/adjust-stock";
import { listMovements } from "../../../operations/inventory/list-movements";
import { getProduct } from "../../../operations/product/get-product";
import { AuthStore } from "../../../store/auth";
import { formatDateTime, formatMoney } from "../../../utils";

@Component({
  selector: "app-product-detail",
  imports: [Layout, HeaderPage, Skeleton, Modal, NumberInput, InputCnt, ButtonCnt, RouterLink],
  templateUrl: "./product-detail.html",
  styleUrl: "./product-detail.css",
})
export class ProductDetail {
  readonly id = input.required<string>();           // lo enlaza el router desde :id
  readonly auth = inject(AuthStore);
  readonly productId = computed(() => Number(this.id()));
  readonly detail = getProduct(this.productId);
  readonly movements = listMovements(this.productId);
  readonly adjustment = adjustStock(this.productId);
  readonly adjusting = signal(false);
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;
  readonly movementTypeLabel = movementTypeLabel;
  readonly productStatusLabel = productStatusLabel;

  async adjust(event: Event): Promise<void> {
    if (await this.adjustment.submit(event)) this.adjusting.set(false);
  }
}
