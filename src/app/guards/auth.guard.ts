import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { PublicRoutes } from "../constants";
import { AuthStore } from "../store/auth";

/** Sin sesión no se entra a nada privado. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree([PublicRoutes.SIGNIN]);
};
