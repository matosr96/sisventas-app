import { describe, expect, it } from "vitest";
import { Resources } from "../constants";
import { QueryClient } from "./query-client";

describe("QueryClient", () => {
  it("recarga solo lo registrado bajo la clave invalidada y respeta la baja", () => {
    const client = new QueryClient();
    const calls: string[] = [];
    const unregister = client.register(Resources.SALES, { reload: () => calls.push("sales") });
    client.register(Resources.PRODUCTS, { reload: () => calls.push("products") });
    client.invalidate(Resources.SALES);
    expect(calls).toEqual(["sales"]);
    client.invalidateAll();
    expect(calls).toEqual(["sales", "sales", "products"]);
    unregister();
    client.invalidate(Resources.SALES, Resources.PRODUCTS);
    expect(calls).toEqual(["sales", "sales", "products", "products"]);
  });
});
