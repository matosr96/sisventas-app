import { TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { ScreenName } from "../../../constants";
import { Table, badge } from "./table";

const rows = [
  { id: 1, name: "Zumo", price: 3, status: badge("Activo", "ok") },
  { id: 2, name: "agua", price: 10, status: badge("Retirado") },
  { id: 3, name: "Café", price: 1, status: badge("Activo", "ok") },
];

const mount = (inputs: Record<string, unknown>) => {
  const fixture = TestBed.createComponent(Table);
  fixture.componentRef.setInput("data", rows);
  fixture.componentRef.setInput("headers", ["Nombre", "Precio", "Estado"]);
  fixture.componentRef.setInput("keys", ["name", "price", "status"]);
  fixture.componentRef.setInput("screenName", ScreenName.PRODUCT);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  fixture.detectChanges();
  return fixture;
};

describe("Table", () => {
  it("en modo cliente ordena números por valor, textos con orden natural y badges por su texto", () => {
    const table = mount({}).componentInstance;
    table.sortBy("price");
    expect(table.rows().map((row) => row["id"])).toEqual([3, 1, 2]);
    table.sortBy("price");
    expect(table.rows().map((row) => row["id"])).toEqual([2, 1, 3]);
    table.sortBy("name");
    expect(table.rows().map((row) => row["name"])).toEqual(["agua", "Café", "Zumo"]);
    table.sortBy("status");
    expect(table.rows()[2]["id"]).toBe(2);
  });

  it("en modo servidor no toca los datos y emite la consulta", () => {
    const fixture = mount({ total: 120, query: { page: 2, limit: 25, sort: "name", dir: "asc" } });
    const table = fixture.componentInstance;
    const emitted: unknown[] = [];
    table.queryChange.subscribe((query) => emitted.push(query));
    expect(table.rows()).toEqual(rows);
    expect(table.pages()).toBe(5);
    expect(table.rangeLabel()).toBe("26–50 de 120");
    table.next();
    table.sortBy("name");
    expect(emitted).toEqual([
      { page: 3, limit: 25, sort: "name", dir: "asc" },
      { page: 1, limit: 25, sort: "name", dir: "desc" },
    ]);
  });

  it("no ordena por una clave que la API no admite", () => {
    const table = mount({ total: 3, query: { page: 1, limit: 25, sort: null, dir: "desc" }, sortableKeys: ["name"] }).componentInstance;
    const emitted: unknown[] = [];
    table.queryChange.subscribe((query) => emitted.push(query));
    table.sortBy("status");
    expect(emitted).toEqual([]);
    expect(table.isSortable("status")).toBe(false);
  });
});
