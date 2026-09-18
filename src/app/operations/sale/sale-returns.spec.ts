import { Injector, runInInjectionContext, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "../../components/shared/toaster/toast";
import type { Sale } from "../../entities";
import { SalesApi } from "../../services";
import { saleReturns } from "./sale-returns";

const sale = {
  id: 4, items: [
    { id: 10, quantity: 2, returnedQuantity: 1, unitPrice: 1200 },
    { id: 11, quantity: 1, returnedQuantity: 0, unitPrice: 3900 },
  ],
} as Sale;

describe("saleReturns", () => {
  const createReturn = vi.fn(async () => ({ returnNumber: "R-2026-000009" }));
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: SalesApi, useValue: { returns: async () => [], createReturn } }] });
  });

  it("topa cada línea con lo no devuelto, suma al precio congelado y exige motivo", async () => {
    const op = runInInjectionContext(TestBed.inject(Injector), () => saleReturns(signal(4)));
    op.setQuantity(10, 5, 1);
    op.setQuantity(11, -3, 1);
    expect(op.quantities()).toEqual({ 10: 1, 11: 0 });
    expect(op.requested()).toEqual([{ saleItemId: 10, quantity: 1 }]);
    expect(op.requestedTotal(sale)).toBe(1200);

    const event = { preventDefault: () => undefined } as Event;
    expect(await op.submit(event)).toBe(false);
    expect(TestBed.inject(Toast).messages().at(-1)?.text).toContain("motivo");
    op.reason.set("Empaque dañado");
    expect(await op.submit(event)).toBe(true);
    expect(createReturn).toHaveBeenCalledWith(4, { reason: "Empaque dañado", items: [{ saleItemId: 10, quantity: 1 }] });
    expect(op.requested()).toEqual([]);
  });
});
