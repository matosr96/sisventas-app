import { Injector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { EmptySummaryState, type Summary } from "../../entities";
import { ReportsApi } from "../../services";
import { homeSummary } from "./home-summary";

const build = async (summary: Summary) => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [{ provide: ReportsApi, useValue: { summary: async () => summary } }] });
  const op = runInInjectionContext(TestBed.inject(Injector), () => homeSummary());
  await new Promise((r) => setTimeout(r, 0));
  TestBed.flushEffects();
  return op;
};

describe("homeSummary", () => {
  it("calcula la variación frente a ayer y la omite sin base", async () => {
    const withBase = await build({ ...EmptySummaryState, todayTotal: 1500, yesterdayTotal: 1000 });
    expect(withBase.todayDelta()).toBe(50);
    expect(withBase.isError()).toBe(false);
    const noBase = await build({ ...EmptySummaryState, todayTotal: 1500, yesterdayTotal: 0 });
    expect(noBase.todayDelta()).toBeNull();
  });
});
