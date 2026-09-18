import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyUsersState } from "../../entities";
import { UsersApi } from "../../services";
import { filterableList, listResource, safeValue } from "../list-resource";

/** Listado con búsqueda y chips derivados en el render: se guarda el término y los filtros, no la lista. */
export function listUsers() {
  const api = inject(UsersApi);
  const ref = listResource(Resources.USERS, () => api.list(), EmptyUsersState);
  const data = safeValue(ref, EmptyUsersState);
  const items = computed(() => data().items);
  const search = filterableList(items, (user, term) => [user.username, user.firstName, user.lastName].join(" ").toLowerCase().includes(term));
  return { ref, items, ...search, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
