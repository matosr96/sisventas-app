import { Injector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Router, UrlTree, provideRouter, type ActivatedRouteSnapshot, type RouterStateSnapshot } from "@angular/router";
import { beforeEach, describe, expect, it } from "vitest";
import { PrivateRoutes, PublicRoutes } from "../constants";
import { RoleName, type User } from "../entities";
import { AuthStore } from "../store/auth";
import { authGuard } from "./auth.guard";
import { roleGuard } from "./role.guard";

const user = (roles: User["roles"]): User => ({ id: 1, firstName: "A", lastName: "B", photo: null, username: "a", roles, status: "ACTIVE", createdAt: "" });
const future = (): string => `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`;
const past = (): string => `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 }))}.s`;

describe("guards", () => {
  let auth: AuthStore;
  let router: Router;
  const run = (guard: ReturnType<typeof roleGuard>) =>
    runInInjectionContext(TestBed.inject(Injector), () => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
    auth.logout();
  });

  it("sin sesión (o con token caducado) manda a ingresar", () => {
    expect(run(authGuard)).toEqual(router.createUrlTree([PublicRoutes.SIGNIN]));
    auth.setSession({ accessToken: past(), tokenType: "Bearer", user: user([RoleName.USER]) });
    expect(auth.isAuthenticated()).toBe(false);
    expect(run(authGuard)).toBeInstanceOf(UrlTree);
  });

  it("con sesión pasa, y sin el rol manda a 'sin permiso'", () => {
    auth.setSession({ accessToken: future(), tokenType: "Bearer", user: user([RoleName.USER]) });
    expect(run(authGuard)).toBe(true);
    expect(run(roleGuard(RoleName.ADMIN))).toEqual(router.createUrlTree([PrivateRoutes.FORBIDDEN]));
    auth.setUser(user([RoleName.USER, RoleName.ADMIN]));
    expect(run(roleGuard(RoleName.ADMIN))).toBe(true);
  });
});
