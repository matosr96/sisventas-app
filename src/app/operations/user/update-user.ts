import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { RoleName, type RoleNameValue, type User, type UserStatusValue } from "../../entities";
import { UsersApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** Rol y estado de otro usuario. La API impide que un admin se bloquee a sí mismo (614). */
export function updateUser(current: User) {
  const api = inject(UsersApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: { role: RoleNameValue | null; status: UserStatusValue | null } = {
    role: current.roles.includes(RoleName.ADMIN) ? RoleName.ADMIN : RoleName.USER,
    status: current.status,
  };
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    pending.set(true);
    try {
      const roles: RoleNameValue[] = form.role === RoleName.ADMIN ? [RoleName.USER, RoleName.ADMIN] : [RoleName.USER];
      await api.setRoles(current.id, roles);
      if (form.status && form.status !== current.status) await api.setStatus(current.id, form.status);
      queryClient.invalidate(Resources.USERS);
      toast.success("Usuario actualizado.");
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
