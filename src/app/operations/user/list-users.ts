import { computed, inject, signal } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyUsersState } from "../../entities";
import { UsersApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

export function listUsers() {
  const api = inject(UsersApi);
  const ref = listResource(Resources.USERS, () => api.list(), EmptyUsersState);
  const data = safeValue(ref, EmptyUsersState);
  const searchTerm = signal("");
  const items = computed(() => data().items);
  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term
      ? items().filter((user) => [user.username, user.firstName, user.lastName].join(" ").toLowerCase().includes(term))
      : items();
  });
  return { ref, items, filtered, searchTerm, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
