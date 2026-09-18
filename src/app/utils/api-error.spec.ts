import { HttpErrorResponse } from "@angular/common/http";
import { describe, expect, it } from "vitest";
import { DEFAULT_ERROR_MESSAGE } from "../constants";
import { apiErrorCode, apiErrorMessage } from "./api-error";

const response = (status: number, body: unknown): HttpErrorResponse => new HttpErrorResponse({ status, error: body });

describe("apiErrorMessage", () => {
  it("traduce el código de dominio y distingue la falta de red", () => {
    expect(apiErrorMessage(response(409, { message: "621" }))).toBe("No hay stock suficiente.");
    expect(apiErrorMessage(response(0, null))).toBe("No hay conexión con el servidor.");
    expect(apiErrorMessage(response(500, { message: "999" }))).toBe(DEFAULT_ERROR_MESSAGE);
    expect(apiErrorMessage(new Error("boom"))).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it("expone el código para que una operación decida", () => {
    expect(apiErrorCode(response(409, { message: "621" }))).toBe("621");
    expect(apiErrorCode(new Error("x"))).toBeNull();
  });
});
