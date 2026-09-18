import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideBrowserGlobalErrorListeners, type ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { authInterceptor } from "./api/auth.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
