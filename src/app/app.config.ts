import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { Injectable, inject, provideBrowserGlobalErrorListeners, type ApplicationConfig } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TitleStrategy, provideRouter, withComponentInputBinding, type RouterStateSnapshot } from "@angular/router";
import { authInterceptor } from "./api/auth.interceptor";
import { routes } from "./app.routes";

/** "Productos · SisVentas": cada ruta declara su título y la pestaña lo muestra. */
@Injectable({ providedIn: "root" })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} · SisVentas` : "SisVentas");
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
  ],
};
