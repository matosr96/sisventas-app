import { inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Toast } from "../../components/shared/toaster/toast";
import { PrivateRoutes } from "../../constants";
import { EmptySigninState, type SigninDto } from "../../entities";
import { AuthApi } from "../../services";
import { AuthStore } from "../../store/auth";
import { apiErrorMessage } from "../../utils";

export function signin() {
  const api = inject(AuthApi);
  const auth = inject(AuthStore);
  const router = inject(Router);
  const toast = inject(Toast);
  const form: SigninDto = { ...EmptySigninState };
  const pending = signal(false);

  const submit = async (event: Event): Promise<void> => {
    event.preventDefault();
    if (pending()) return; // Enter repetido mientras se guarda: una sola petición
    pending.set(true);
    try {
      auth.setSession(await api.signin(form));
      await router.navigate([PrivateRoutes.HOME]);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      pending.set(false);
    }
  };

  return { form, pending, submit };
}
