import { describe, expect, it } from "vitest";
import { tokenExpiresAt } from "./auth";

const tokenWith = (payload: object): string => `h.${btoa(JSON.stringify(payload)).replace(/=+$/, "")}.s`;

describe("tokenExpiresAt", () => {
  it("lee exp del JWT y tolera tokens sin él o malformados", () => {
    expect(tokenExpiresAt(tokenWith({ exp: 1_800_000_000 }))).toBe(1_800_000_000_000);
    expect(tokenExpiresAt(tokenWith({ sub: "x" }))).toBeNull();
    expect(tokenExpiresAt("garbage")).toBeNull();
  });
});
