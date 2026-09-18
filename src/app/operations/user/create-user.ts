import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { EmptySignupState, type SignupDto } from "../../entities";
import { AuthApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** El alta es el signup público de la API: nace con rol vendedor; el rol se cambia después. */
export function createUser() {
  const api = inject(AuthApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: SignupDto = { ...EmptySignupState };
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    pending.set(true);
    try {
      await api.signup({ ...form });
      queryClient.invalidate(Resources.USERS);
      toast.success("Usuario creado correctamente.");
      Object.assign(form, { ...EmptySignupState });
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
