import { Injector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { describe, expect, it, vi } from "vitest";
import { Resources } from "../constants";
import type { ListQuery } from "../entities";
import { serverList } from "./list-resource";

describe("serverList", () => {
  it("manda página, orden, chips y búsqueda con retardo al cargador", () => {
    vi.useFakeTimers();
    const calls: ListQuery[] = [];
    const loader = vi.fn(async (query: ListQuery) => { calls.push(query); return { count: 1, page: query.page, pages: 1, items: [{ id: 1 }] }; });
    const list = runInInjectionContext(TestBed.inject(Injector), () => serverList(Resources.PRODUCTS, loader, { sort: "name", dir: "asc" }));
    TestBed.flushEffects();
    list.setFilter("status", "ACTIVE");
    list.onQuery({ page: 3, limit: 50, sort: "price", dir: "desc" });
    list.searchTerm.set("ag");
    TestBed.flushEffects();
    expect(list.query().search).toBe("");
    vi.advanceTimersByTime(350);
    TestBed.flushEffects();
    expect(list.query()).toMatchObject({ page: 1, limit: 50, sort: "price", dir: "desc", search: "ag", filters: { status: "ACTIVE" } });
    expect(list.hasFilters()).toBe(true);
    list.clearFilters();
    expect(list.query().filters).toEqual({});
    vi.useRealTimers();
  });
});
