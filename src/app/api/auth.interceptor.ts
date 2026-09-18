import { HttpErrorResponse, type HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { PublicRoutes } from "../constants";
import { AuthStore } from "../store/auth";

/** Adjunta el token a toda petición y cierra la sesión si la API responde 401. */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const token = auth.token();
  const authorized = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.includes("/auth/")) {
        auth.logout();
        void router.navigate([PublicRoutes.SIGNIN]);
      }
      return throwError(() => error);
    })
  );
};
