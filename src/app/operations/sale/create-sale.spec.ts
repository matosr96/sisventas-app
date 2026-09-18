import { Injector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { beforeEach, describe, expect, it } from "vitest";
import { PaymentMethod, type Product } from "../../entities";
import { CategoriesApi, ProductsApi, SalesApi } from "../../services";
import { SettingsStore } from "../../store/settings";
import { createSale } from "./create-sale";

const product = (id: number, price: number, stock: number): Product => ({
  id, sku: `SKU-${id}`, name: `Producto ${id}`, purchasePrice: null, salePrice: price, currentStock: stock, initialStock: stock,
  status: "ACTIVE", image: null, lowStock: null, categoryId: null, createdBy: null, createdAt: "", updatedAt: null,
});

describe("createSale (carrito y cobro)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ProductsApi, useValue: { list: async () => ({ count: 0, page: 1, pages: 0, items: [] }) } },
        { provide: CategoriesApi, useValue: { list: async () => ({ count: 0, page: 1, pages: 0, items: [] }) } },
        { provide: SalesApi, useValue: { create: async () => ({ id: 1, saleNumber: "F-1" }) } },
      ],
    });
    TestBed.inject(SettingsStore).settings.set({ businessName: "x", currency: "COP", taxRate: 19 });
  });

  const build = () => runInInjectionContext(TestBed.inject(Injector), () => createSale());

  it("suma unidades del mismo producto, topa con el stock y quita la línea en cero", () => {
    const op = build();
    const agua = product(1, 1000, 2);
    op.add(agua);
    op.add(agua);
    op.add(agua); // tercera: no hay más stock
    expect(op.quantityOf(1)).toBe(2);
    expect(op.itemCount()).toBe(2);
    op.decrement(1);
    op.decrement(1);
    expect(op.cart()).toEqual([]);
    op.add(product(2, 500, 0));
    expect(op.cart()).toEqual([]);
  });

  it("calcula subtotal, descuento, impuesto, total y cambio como la API", () => {
    const op = build();
    op.add(product(1, 1000, 10));
    op.setQuantity(1, 3);
    op.setCheckout({ discount: 500, paymentMethod: PaymentMethod.CASH, amountPaid: 5000 });
    expect(op.subtotal()).toBe(3000);
    expect(op.discount()).toBe(500);
    expect(op.tax()).toBe(475);
    expect(op.estimatedTotal()).toBe(2975);
    expect(op.change()).toBe(2025);
    expect(op.canConfirm()).toBe(true);
    op.setCheckout({ amountPaid: 100 });
    expect(op.canConfirm()).toBe(false);
    op.setCheckout({ paymentMethod: PaymentMethod.CARD });
    expect(op.change()).toBe(0);
    expect(op.canConfirm()).toBe(true);
    op.setCheckout({ discount: 99999 });
    expect(op.discount()).toBe(3000);
  });
});
