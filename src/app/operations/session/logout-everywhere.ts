import { inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Confirm } from "../../components/shared/confirm-dialog/confirm";
import { Toast } from "../../components/shared/toaster/toast";
import { PublicRoutes } from "../../constants";
import { AuthApi } from "../../services";
import { AuthStore } from "../../store/auth";
import { apiErrorMessage } from "../../utils";

/** Cierra la sesión en todos los dispositivos, este incluido: la API invalida todos los tokens. */
export function logoutEverywhere() {
  const api = inject(AuthApi);
  const auth = inject(AuthStore);
  const confirm = inject(Confirm);
  const toast = inject(Toast);
  const router = inject(Router);
  const pending = signal(false);

  const run = async (): Promise<void> => {
    const accepted = await confirm.ask({
      title: "Cerrar sesión en todos los dispositivos",
      message: "Todas tus sesiones abiertas, esta incluida, dejarán de valer y tendrás que volver a ingresar.",
      confirmLabel: "Cerrar todas", tone: "danger",
    });
    if (!accepted || pending()) return;
    pending.set(true);
    try {
      await api.logoutEverywhere();
      auth.logout();
      toast.success("Sesiones cerradas en todos los dispositivos.");
      await router.navigate([PublicRoutes.SIGNIN]);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      pending.set(false);
    }
  };

  return { run, pending };
}
