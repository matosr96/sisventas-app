import { inject, signal } from "@angular/core";
import { Toast } from "../../components/shared/toaster/toast";
import { EmptyResetPasswordState, type ResetPasswordDto } from "../../entities";
import { UsersApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** Reinicio por administrador: sin la contraseña actual; la API cierra las sesiones de ese usuario. */
export function resetUserPassword(userId: number) {
  const api = inject(UsersApi);
  const toast = inject(Toast);
  const form: ResetPasswordDto = { ...EmptyResetPasswordState };
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false;
    if (form.newPassword.length < 8) { toast.error("La contraseña nueva necesita al menos 8 caracteres."); return false; }
    pending.set(true);
    try {
      await api.resetPassword(userId, { ...form });
      toast.success("Contraseña reiniciada; sus sesiones abiertas se cerraron.");
      Object.assign(form, { ...EmptyResetPasswordState });
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    } finally {
      pending.set(false);
    }
  };

  return { form, pending, submit };
}
