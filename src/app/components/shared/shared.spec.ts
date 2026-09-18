import { TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { BarChart } from "../container/bar-chart/bar-chart";
import { MetricCard } from "../container/metric-card/metric-card";
import { Badge } from "./badge/badge";
import { DateRangePicker } from "./date-range/date-range";
import { FilterChips } from "./filter-chips/filter-chips";

const create = <T>(component: new () => T, inputs: Record<string, unknown>) => {
  const fixture = TestBed.createComponent(component);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  fixture.detectChanges();
  return fixture;
};

describe("kit compartido", () => {
  it("Badge pinta el tono como clase", () => {
    const el = create(Badge, { label: "Activo", tone: "ok" }).nativeElement as HTMLElement;
    expect(el.querySelector(".badge")?.className).toContain("ok");
    expect(el.textContent).toContain("Activo");
  });

  it("FilterChips emite null en 'Todos' y el valor del chip elegido", () => {
    const fixture = create(FilterChips, { options: [{ value: "ACTIVE", label: "Activos" }], value: "ACTIVE" });
    const emitted: (string | null)[] = [];
    fixture.componentInstance.value.subscribe((v) => emitted.push(v));
    const chips = fixture.nativeElement.querySelectorAll("button.chip") as NodeListOf<HTMLButtonElement>;
    expect(chips[1].className).toContain("active");
    chips[0].click();
    expect(emitted).toEqual([null]);
  });

  it("DateRangePicker ofrece atajos y limpia el rango", () => {
    const fixture = create(DateRangePicker, {});
    const picker = fixture.componentInstance;
    const today = new Date().toISOString().slice(0, 10);
    expect(picker.presets[0]).toEqual({ label: "Hoy", from: today, to: today });
    picker.value.set({ from: today, to: today });
    expect(picker.isPreset(today, today)).toBe(true);
    picker.set("to", { target: { value: "" } } as unknown as Event);
    expect(picker.value()).toEqual({ from: today, to: null });
  });

  it("MetricCard muestra la variación con signo y color", () => {
    const up = create(MetricCard, { label: "Cobrado", value: "$ 1", delta: 12, hint: "vs. ayer" }).nativeElement as HTMLElement;
    expect(up.querySelector(".delta")?.className).toContain("up");
    expect(up.textContent).toContain("+12%");
    const none = create(MetricCard, { label: "x", value: 0, delta: null }).nativeElement as HTMLElement;
    expect(none.querySelector(".delta")).toBeNull();
  });

  it("BarChart escala al máximo, limita el ancho de barra y espacia las etiquetas", () => {
    const one = create(BarChart, { points: [{ label: "09-18", value: 100 }] }).componentInstance;
    expect(one.bars()[0].width).toBe(48);
    expect(one.bars()[0].height).toBe(180);
    const many = create(BarChart, { points: Array.from({ length: 30 }, (_, i) => ({ label: String(i), value: i })) }).componentInstance;
    expect(many.bars().filter((bar) => bar.label !== "").length).toBe(10);
    expect(Math.max(...many.bars().map((bar) => bar.height))).toBe(180);
  });
});
