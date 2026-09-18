import { describe, expect, it } from "vitest";
import { dayRangeToInstants, formatMoney, fromDateTimeInput, setCurrency, toDateTimeInput, toNumber } from "./format";

describe("format", () => {
  it("siempre pinta dos decimales y respeta la moneda configurada", () => {
    expect(formatMoney(1100.5)).toMatch(/1\.100,50/);
    expect(formatMoney(null)).toBe("");
    setCurrency("USD");
    expect(formatMoney(2)).toMatch(/2,00/);
    setCurrency("COP");
  });

  it("convierte entradas numéricas sin NaN", () => {
    expect(toNumber("")).toBeNull();
    expect(toNumber("abc")).toBeNull();
    expect(toNumber("12.5")).toBe(12.5);
  });

  it("va y vuelve del input datetime-local", () => {
    const iso = new Date(2026, 8, 18, 14, 30).toISOString();
    expect(toDateTimeInput(iso)).toBe("2026-09-18T14:30");
    expect(fromDateTimeInput("2026-09-18T14:30")).toBe(iso);
    expect(fromDateTimeInput("")).toBeNull();
  });

  it("un rango de días cubre desde la medianoche hasta el último milisegundo", () => {
    const range = dayRangeToInstants("2026-09-18", "2026-09-18");
    expect(new Date(range.from!).getHours()).toBe(0);
    expect(new Date(range.to!).getHours()).toBe(23);
    expect(dayRangeToInstants(null, null)).toEqual({ from: null, to: null });
  });
});
