import { Injector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "../../components/shared/toaster/toast";
import type { Product } from "../../entities";
import { CategoriesApi, ProductsApi, PurchasesApi, SuppliersApi } from "../../services";
import { createPurchase } from "./create-purchase";

const product = (id: number, cost: number | null): Product => ({
  id, sku: `SKU-${id}`, name: `P${id}`, purchasePrice: cost, salePrice: 10, currentStock: 0, initialStock: 0, status: "ACTIVE",
  image: null, lowStock: null, categoryId: null, createdBy: null, createdAt: "", updatedAt: null,
});
const empty = async () => ({ count: 0, page: 1, pages: 0, items: [] });

describe("createPurchase", () => {
  const create = vi.fn(async () => ({ id: 7, purchaseNumber: "P-2026-000007" }));
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ProductsApi, useValue: { list: empty } }, { provide: CategoriesApi, useValue: { list: empty } },
        { provide: SuppliersApi, useValue: { list: empty } }, { provide: PurchasesApi, useValue: { create } },
      ],
    });
  });

  it("precarga el último costo, no topa con el stock y exige proveedor y costo en todas las líneas", async () => {
    const op = runInInjectionContext(TestBed.inject(Injector), () => createPurchase());
    const toast = TestBed.inject(Toast);
    const event = { preventDefault: () => undefined } as Event;
    op.add(product(1, 800));
    op.add(product(1, 800));
    op.add(product(2, null));
    expect(op.cart().map((line) => [line.quantity, line.unitCost])).toEqual([[2, 800], [1, null]]);
    expect(op.total()).toBe(1600);

    await op.submit(event);
    expect(toast.messages().at(-1)?.text).toBe("Elige el proveedor.");
    op.supplierId.set(3);
    await op.submit(event);
    expect(toast.messages().at(-1)?.text).toContain("costo unitario");
    op.setUnitCost(2, 50);
    await op.submit(event);
    expect(create).toHaveBeenCalledWith({ supplierId: 3, items: [{ productId: 1, quantity: 2, unitCost: 800 }, { productId: 2, quantity: 1, unitCost: 50 }] });
  });
});
