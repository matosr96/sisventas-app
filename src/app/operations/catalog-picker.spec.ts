import { Injector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ListQuery, Product } from "../entities";
import { CategoriesApi, ProductsApi } from "../services";
import { catalogPicker } from "./catalog-picker";

const product = (id: number, sku: string, name: string): Product => ({
  id, sku, name, purchasePrice: null, salePrice: 1, currentStock: 5, initialStock: 5, status: "ACTIVE",
  image: null, lowStock: null, categoryId: null, createdBy: null, createdAt: "", updatedAt: null,
});

describe("catalogPicker", () => {
  const list = vi.fn(async (query: ListQuery) => {
    const all = [product(1, "AGUA-600", "Agua"), product(2, "AGUA-1L", "Agua grande"), product(3, "JAB-REY", "Jabón")];
    const term = query.search.toLowerCase();
    return { count: 3, page: 1, pages: 1, items: term ? all.filter((p) => p.sku.toLowerCase().includes(term) || p.name.toLowerCase().includes(term)) : all };
  });

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductsApi, useValue: { list } },
        { provide: CategoriesApi, useValue: { list: async () => ({ count: 0, page: 1, pages: 0, items: [] }) } },
      ],
    });
  });

  it("pide al servidor con retardo y resuelve el SKU exacto o el único candidato", async () => {
    const picker = runInInjectionContext(TestBed.inject(Injector), () => catalogPicker());
    TestBed.flushEffects();
    await vi.runOnlyPendingTimersAsync();
    TestBed.flushEffects();
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ filters: expect.objectContaining({ status: "ACTIVE" }) }));
    expect(picker.exactMatch()).toBeNull();

    picker.searchTerm.set("agua");
    TestBed.flushEffects();
    await vi.advanceTimersByTimeAsync(300);
    TestBed.flushEffects();
    await vi.runOnlyPendingTimersAsync();
    TestBed.flushEffects();
    expect(picker.visible().length).toBe(2);
    expect(picker.exactMatch()).toBeNull();

    picker.searchTerm.set("agua-1l");
    TestBed.flushEffects();
    await vi.advanceTimersByTimeAsync(300);
    TestBed.flushEffects();
    await vi.runOnlyPendingTimersAsync();
    TestBed.flushEffects();
    expect(picker.exactMatch()?.id).toBe(2);
    vi.useRealTimers();
  });
});
