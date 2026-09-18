import { DestroyRef, effect, inject, untracked } from "@angular/core";
import { Router } from "@angular/router";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { PublicRoutes } from "../../constants";
import { AuthApi } from "../../services";
import { AuthStore } from "../../store/auth";
import { SettingsStore } from "../../store/settings";

const WARN_BEFORE_MS = 5 * 60 * 1000;

/**
 * Ciclo de vida de la sesión, una sola vez en App: al entrar refresca el usuario (el rol pudo
 * cambiar) y la configuración del negocio; avisa cinco minutos antes de que caduque el token y
 * sale cuando caduca; al volver a la pestaña recarga lo que esté en pantalla.
 */
export function session() {
  const auth = inject(AuthStore);
  const settings = inject(SettingsStore);
  const authApi = inject(AuthApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const router = inject(Router);
  const destroyRef = inject(DestroyRef);

  let warnTimer: ReturnType<typeof setTimeout> | undefined;
  let endTimer: ReturnType<typeof setTimeout> | undefined;
  const clear = (): void => { clearTimeout(warnTimer); clearTimeout(endTimer); };

  effect(() => {
    const token = auth.token();
    const expiresAt = auth.expiresAt();
    clear();
    if (!token) return;
    untracked(() => {
      void settings.load();
      authApi.me().then((user) => auth.setUser(user)).catch(() => undefined);
      if (expiresAt === null) return;
      const remaining = expiresAt - Date.now();
      if (remaining > WARN_BEFORE_MS) {
        warnTimer = setTimeout(() => toast.notice("Tu sesión caduca en cinco minutos. Guarda lo que tengas a medias."), remaining - WARN_BEFORE_MS);
      }
      endTimer = setTimeout(() => {
        auth.logout();
        toast.notice("Tu sesión caducó. Vuelve a ingresar.");
        void router.navigate([PublicRoutes.SIGNIN]);
      }, Math.max(0, remaining));
    });
  });

  const onVisible = (): void => { if (document.visibilityState === "visible" && auth.isAuthenticated()) queryClient.invalidateAll(); };
  document.addEventListener("visibilitychange", onVisible);
  destroyRef.onDestroy(() => { clear(); document.removeEventListener("visibilitychange", onVisible); });
}
