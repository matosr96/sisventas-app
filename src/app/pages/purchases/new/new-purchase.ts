import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, HeaderPage, Loader, NumberInput, SelectCpt, type SelectOption } from "../../../components/shared";
import { PrivateRoutes } from "../../../constants";
import { createPurchase } from "../../../operations/purchase/create-purchase";
import { formatMoney } from "../../../utils";

@Component({
  selector: "app-new-purchase",
  imports: [Layout, HeaderPage, Loader, SelectCpt, NumberInput, ButtonCnt, RouterLink],
  templateUrl: "./new-purchase.html",
  styleUrl: "./new-purchase.css",
})
export class NewPurchase {
  readonly op = createPurchase();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly supplierOptions = computed<SelectOption<number>[]>(() => this.op.activeSuppliers().map((s) => ({ value: s.id, label: s.name })));
  readonly productOptions = computed<SelectOption<number>[]>(() => this.op.purchasable().map((p) => ({ value: p.id, label: `${p.sku} — ${p.name}` })));
}
