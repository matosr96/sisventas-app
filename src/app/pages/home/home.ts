import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MetricCard } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { Badge, HeaderPage, Skeleton } from "../../components/shared";
import { PrivateRoutes } from "../../constants";
import { homeSummary } from "../../operations/home/home-summary";
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
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;

  sell(): void { void this.router.navigate([PrivateRoutes.SALES, "nueva"]); }
}
