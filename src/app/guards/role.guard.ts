import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { PrivateRoutes } from "../constants";
import type { RoleNameValue } from "../entities";
import { AuthStore } from "../store/auth";

/** Sin el rol, a Inicio. Los permisos viven en las rutas (app.routes.ts) y en el menú, no en las pantallas. */
export const roleGuard = (...roles: RoleNameValue[]): CanActivateFn => () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const allowed = auth.roles().some((role) => roles.includes(role));
  return allowed ? true : router.createUrlTree([PrivateRoutes.HOME]);
};
