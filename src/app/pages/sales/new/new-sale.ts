import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, HeaderPage, Loader, NumberInput, SelectCpt, type SelectOption } from "../../../components/shared";
import { PrivateRoutes } from "../../../constants";
import { createSale } from "../../../operations/sale/create-sale";
import { formatMoney } from "../../../utils";

@Component({
  selector: "app-new-sale",
  imports: [Layout, HeaderPage, Loader, SelectCpt, NumberInput, ButtonCnt, RouterLink],
  templateUrl: "./new-sale.html",
  styleUrl: "./new-sale.css",
})
export class NewSale {
  readonly op = createSale();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly productOptions = computed<SelectOption<number>[]>(() =>
    this.op.sellable().map((p) => ({ value: p.id, label: `${p.sku} — ${p.name} (${p.currentStock} en stock)` }))
  );
}
