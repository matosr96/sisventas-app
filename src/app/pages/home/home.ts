import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MetricCard } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, Loader } from "../../components/shared";
import { PrivateRoutes } from "../../constants";
import { homeSummary } from "../../operations/home/home-summary";
import { AuthStore } from "../../store/auth";
import { formatDateTime, formatMoney } from "../../utils";

@Component({
  selector: "app-home",
  imports: [Layout, HeaderPage, Loader, MetricCard, RouterLink],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {
  readonly auth = inject(AuthStore);
  readonly summary = homeSummary();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDateTime = formatDateTime;
}
