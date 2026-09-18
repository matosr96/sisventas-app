import { HttpErrorResponse, type HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { Toast } from "../components/shared/toaster/toast";
import { PublicRoutes } from "../constants";
import { AuthStore } from "../store/auth";

/**
 * Adjunta el token a toda petición. Un 401 fuera de /auth significa que la sesión ya no vale
 * (caducó, la cuenta se desactivó o se cerró en todos los dispositivos): se sale explicando por
 * qué. Un 403 se avisa aquí, una sola vez, en vez de dejarlo como error genérico de cada pantalla.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const toast = inject(Toast);
  const token = auth.token();
  const authorized = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !request.url.includes("/auth/")) {
        if (error.status === 401 && auth.isAuthenticated()) {
          auth.logout();
          toast.notice("Tu sesión terminó. Vuelve a ingresar.");
          void router.navigate([PublicRoutes.SIGNIN]);
        } else if (error.status === 403) {
          toast.error("No tienes permiso para esta acción.");
        }
      }
      return throwError(() => error);
    })
  );
};
