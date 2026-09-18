import { describe, expect, it } from "vitest";
import { Confirm } from "./confirm";

describe("Confirm", () => {
  it("resuelve la promesa con la respuesta y una nueva pregunta cancela la anterior", async () => {
    const confirm = new Confirm();
    const first = confirm.ask({ title: "¿Borrar?", message: "x" });
    expect(confirm.pending()?.title).toBe("¿Borrar?");
    const second = confirm.ask({ title: "¿Otra?", message: "y" });
    await expect(first).resolves.toBe(false);
    confirm.answer(true);
    await expect(second).resolves.toBe(true);
    expect(confirm.pending()).toBeNull();
  });
});
