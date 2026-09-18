import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Router, provideRouter } from "@angular/router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "../components/shared/toaster/toast";
import { PublicRoutes } from "../constants";
import { RoleName } from "../entities";
import { AuthStore } from "../store/auth";
import { authInterceptor } from "./auth.interceptor";

const token = `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`;

describe("authInterceptor", () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let auth: AuthStore;
  let toast: Toast;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthStore);
    toast = TestBed.inject(Toast);
    navigate = vi.spyOn(TestBed.inject(Router), "navigate").mockResolvedValue(true);
    auth.setSession({ accessToken: token, tokenType: "Bearer", user: { id: 1, firstName: "A", lastName: "B", photo: null, username: "a", roles: [RoleName.USER], status: "ACTIVE", createdAt: "" } });
  });

  it("adjunta el token y, ante un 401 fuera de /auth, cierra la sesión avisando", () => {
    http.get("/api/v1/products").subscribe({ error: () => undefined });
    const request = backend.expectOne("/api/v1/products");
    expect(request.request.headers.get("Authorization")).toBe(`Bearer ${token}`);
    request.flush({ message: "611" }, { status: 401, statusText: "Unauthorized" });
    expect(auth.isAuthenticated()).toBe(false);
    expect(navigate).toHaveBeenCalledWith([PublicRoutes.SIGNIN]);
    expect(toast.messages().some((m) => m.text.includes("sesión"))).toBe(true);
  });

  it("un 401 del propio ingreso no toca la sesión y un 403 solo avisa", () => {
    http.post("/api/v1/auth/signin", {}).subscribe({ error: () => undefined });
    backend.expectOne("/api/v1/auth/signin").flush({ message: "611" }, { status: 401, statusText: "Unauthorized" });
    expect(auth.isAuthenticated()).toBe(true);
    http.delete("/api/v1/products/1").subscribe({ error: () => undefined });
    backend.expectOne("/api/v1/products/1").flush({ message: "613" }, { status: 403, statusText: "Forbidden" });
    expect(auth.isAuthenticated()).toBe(true);
    expect(toast.messages().at(-1)?.text).toBe("No tienes permiso para esta acción.");
    expect(navigate).not.toHaveBeenCalled();
  });
});
