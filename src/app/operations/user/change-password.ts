import { inject, signal } from "@angular/core";
import { Toast } from "../../components/shared/toaster/toast";
import { EmptyChangePasswordState, type ChangePasswordDto } from "../../entities";
import { AuthApi } from "../../services";
import { apiErrorMessage } from "../../utils";

export function changePassword() {
  const api = inject(AuthApi);
  const toast = inject(Toast);
  const form: ChangePasswordDto = { ...EmptyChangePasswordState };
  const pending = signal(false);

  const submit = async (event: Event): Promise<void> => {
    event.preventDefault();
    if (form.newPassword.length < 8) { toast.error("La contraseña nueva necesita al menos 8 caracteres."); return; }
    pending.set(true);
    try {
      await api.changePassword({ ...form });
      toast.success("Contraseña actualizada.");
      Object.assign(form, { ...EmptyChangePasswordState });
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      pending.set(false);
    }
  };

  return { form, pending, submit };
}
