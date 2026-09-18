import { inject, signal } from "@angular/core";
import { Toast } from "../../components/shared/toaster/toast";
import type { UpdateUserProfileDto, User } from "../../entities";
import { AuthApi } from "../../services";
import { AuthStore } from "../../store/auth";
import { apiErrorMessage } from "../../utils";

/** Los propios nombre, apellido y foto. Al guardar se refresca el usuario en sesión sin pedir otro token. */
export function updateProfile(current: User) {
  const api = inject(AuthApi);
  const auth = inject(AuthStore);
  const toast = inject(Toast);
  const form: UpdateUserProfileDto = { firstName: current.firstName, lastName: current.lastName, photo: current.photo ?? "" };
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false;
    pending.set(true);
    try {
      auth.setUser(await api.updateMe({ ...form }));
      toast.success("Perfil actualizado.");
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
