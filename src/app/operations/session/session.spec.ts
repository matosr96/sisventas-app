import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Router, provideRouter } from "@angular/router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "../../components/shared/toaster/toast";
import { PublicRoutes } from "../../constants";
import { RoleName } from "../../entities";
import { AuthApi, SettingsApi } from "../../services";
import { AuthStore } from "../../store/auth";
import { session } from "./session";

@Component({ selector: "app-host", template: "" })
class Host { constructor() { session(); } }

const tokenExpiringIn = (seconds: number): string => `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds }))}.s`;
const user = { id: 1, firstName: "A", lastName: "B", photo: null, username: "a", roles: [RoleName.USER], status: "ACTIVE" as const, createdAt: "" };

describe("session", () => {
  let navigate: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthApi, useValue: { me: async () => ({ ...user, roles: [RoleName.USER, RoleName.ADMIN] }) } },
        { provide: SettingsApi, useValue: { get: async () => ({ businessName: "x", currency: "USD", taxRate: 0 }) } },
      ],
    });
    navigate = vi.spyOn(TestBed.inject(Router), "navigate").mockResolvedValue(true);
  });

  it("refresca el usuario al entrar, avisa cinco minutos antes y sale al caducar", async () => {
    const auth = TestBed.inject(AuthStore);
    const toast = TestBed.inject(Toast);
    auth.setSession({ accessToken: tokenExpiringIn(600), tokenType: "Bearer", user });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);
    expect(auth.isAdmin()).toBe(true);
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000 + 1000);
    expect(toast.messages().some((m) => m.text.includes("cinco minutos"))).toBe(true);
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    expect(auth.isAuthenticated()).toBe(false);
    expect(navigate).toHaveBeenCalledWith([PublicRoutes.SIGNIN]);
    vi.useRealTimers();
  });
});
