import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BarChart, MetricCard, type BarPoint } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { DateRangePicker, HeaderPage, Skeleton } from "../../components/shared";
import { PrivateRoutes } from "../../constants";
import { salesReport } from "../../operations/report/sales-report";
import { formatDate, formatMoney } from "../../utils";

/** Informe de ventas de un periodo: totales, serie diaria, por vendedor y productos más vendidos con margen. */
@Component({
  selector: "app-reports",
  imports: [Layout, HeaderPage, Skeleton, MetricCard, BarChart, DateRangePicker, RouterLink],
  templateUrl: "./reports.html",
  styleUrl: "./reports.css",
})
export class Reports {
  readonly op = salesReport();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly formatDate = formatDate;
  readonly periodLabel = computed(() => {
    const report = this.op.report();
    return report.from ? `${formatDate(report.from)} – ${formatDate(this.dayBefore(report.to))}` : "";
  });
  readonly byDay = computed<BarPoint[]>(() =>
    this.op.report().byDay.map((point) => ({ label: point.day.slice(5), value: point.total, hint: `${formatDate(point.day)}: ${formatMoney(point.total)} (${point.count} ventas)` }))
  );
  readonly marginPercent = computed(() => {
    const report = this.op.report();
    return report.total === 0 ? null : Math.round((report.estimatedMargin / report.total) * 100);
  });
  readonly maxUserTotal = computed(() => Math.max(1, ...this.op.report().byUser.map((user) => user.total)));

  /** La API devuelve `to` exclusivo (medianoche siguiente): se muestra el día anterior. */
  private dayBefore(iso: string): string { const date = new Date(iso); date.setDate(date.getDate() - 1); return date.toISOString(); }
}
