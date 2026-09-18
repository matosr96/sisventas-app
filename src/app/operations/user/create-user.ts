import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { EmptyCreateUserState, type CreateUserDto } from "../../entities";
import { UsersApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** Alta por administrador (POST /users): elige el rol de entrada y no pasa por el límite del registro público. */
export function createUser() {
  const api = inject(UsersApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: CreateUserDto = { ...EmptyCreateUserState };
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false;
    pending.set(true);
    try {
      await api.create({ ...form, photo: form.photo.trim() });
      queryClient.invalidate(Resources.USERS);
      toast.success("Usuario creado correctamente.");
      Object.assign(form, { ...EmptyCreateUserState });
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
