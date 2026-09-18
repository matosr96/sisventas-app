import { DestroyRef, computed, inject, resource, signal, type ResourceRef, type Signal } from "@angular/core";
import { QueryClient } from "../api/query-client";
import type { Resource } from "../constants";

/**
 * Recurso de lectura registrado bajo su clave: cualquier mutación que invalide la clave lo
 * recarga. Se da de baja solo cuando muere el componente que lo creó.
 */
export function listResource<T>(key: Resource, loader: () => Promise<T>, defaultValue: T): ResourceRef<T> {
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const ref = resource<T, undefined>({ loader: () => loader(), defaultValue });
  destroyRef.onDestroy(queryClient.register(key, ref));
  return ref;
}

/**
 * `ref.value()` LANZA cuando el recurso está en error. Las pantallas leen siempre por aquí:
 * en error devuelve el valor por defecto y dejan que `isError` pinte el aviso.
 */
export function safeValue<T>(ref: ResourceRef<T>, fallback: T): Signal<T> {
  return computed(() => (ref.status() === "error" ? fallback : ref.value()));
}

/** Filtros de chips: campo del registro → valor elegido como texto, o null si el chip es "Todos". */
export type Filters = Record<string, string | null>;

/**
 * Búsqueda y filtros derivados en el render: se guarda el término y los chips, nunca la lista
 * filtrada. `filtered` aplica el término (con `matches`) y cada filtro activo comparando el
 * campo del registro como texto; `hasFilters` distingue "no hay datos" de "nada coincide".
 */
export function filterableList<T>(items: Signal<T[]>, matches: (item: T, term: string) => boolean) {
  const searchTerm = signal("");
  const filters = signal<Filters>({});
  const hasFilters = computed(() => searchTerm().trim() !== "" || Object.values(filters()).some((value) => value != null));
  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    const active = Object.entries(filters()).filter(([, value]) => value != null);
    return items().filter((item) =>
      (!term || matches(item, term)) && active.every(([key, value]) => String((item as Record<string, unknown>)[key]) === value)
    );
  });
  const setFilter = (key: string, value: string | null): void => filters.update((current) => ({ ...current, [key]: value }));
  const clearFilters = (): void => { searchTerm.set(""); filters.set({}); };
  return { searchTerm, filters, filtered, hasFilters, setFilter, clearFilters };
}
