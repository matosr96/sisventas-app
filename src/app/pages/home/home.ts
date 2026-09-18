import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MetricCard } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { Badge, HeaderPage, Skeleton } from "../../components/shared";
import { PrivateRoutes } from "../../constants";
import { paymentMethodLabel } from "../../entities";
import { homeSummary } from "../../operations/home/home-summary";
import { listProducts } from "../../operations/product/list-products";
import { listSales } from "../../operations/sale/list-sales";
import { AuthStore } from "../../store/auth";
import { formatDateTime, formatMoney } from "../../utils";

@Component({
  selector: "app-home",
  imports: [Layout, HeaderPage, Skeleton, MetricCard, Badge, RouterLink],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly summary = homeSummary();
  /** Dos listas cortas pedidas al servidor con su filtro: no se recorre el catálogo en el cliente. */
  readonly lowStock = listProducts({ limit: 8, sort: "stock", dir: "asc", filters: { lowStock: "true", status: "ACTIVE" } });
  readonly recent = listSales({ limit: 6 });
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;
  readonly paymentMethodLabel = paymentMethodLabel;

  sell(): void { void this.router.navigate([PrivateRoutes.SALES, "nueva"]); }
}
