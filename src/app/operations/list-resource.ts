import { DestroyRef, computed, effect, inject, resource, signal, untracked, type ResourceRef, type Signal } from "@angular/core";
import { QueryClient } from "../api/query-client";
import type { Resource } from "../constants";
import { EmptyQueryState, type ListQuery, type ListState } from "../entities";

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

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Listado paginado, ordenado y filtrado EN EL SERVIDOR. La consulta vive en señales; cambiar
 * cualquiera dispara la recarga (la búsqueda, con retardo para no pedir por cada tecla). La
 * tabla recibe `count`/`tableQuery` y devuelve `onQuery`; los chips usan `setFilter`.
 * `hasFilters` distingue "no hay datos" de "nada coincide con lo pedido".
 */
export function serverList<T>(key: Resource, loader: (query: ListQuery) => Promise<ListState<T>>,
                              initial: Partial<ListQuery> = {}) {
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const empty: ListState<T> = { count: 0, page: 0, pages: 0, items: [] };

  const searchTerm = signal(initial.search ?? "");
  const debouncedSearch = signal(initial.search ?? "");
  const query = signal<ListQuery>({ ...EmptyQueryState, ...initial, search: initial.search ?? "" });

  let timer: ReturnType<typeof setTimeout> | undefined;
  effect(() => {
    const term = searchTerm();
    clearTimeout(timer);
    timer = setTimeout(() => debouncedSearch.set(term), SEARCH_DEBOUNCE_MS);
  });
  effect(() => {
    const term = debouncedSearch();
    untracked(() => query.update((current) => (current.search === term ? current : { ...current, search: term, page: 1 })));
  });
  destroyRef.onDestroy(() => clearTimeout(timer));

  const ref = resource<ListState<T>, ListQuery>({ params: () => query(), loader: ({ params }) => loader(params), defaultValue: empty });
  destroyRef.onDestroy(queryClient.register(key, ref));
  const data = safeValue(ref, empty);

  const setFilter = (field: string, value: string | null): void =>
    query.update((current) => ({ ...current, page: 1, filters: { ...current.filters, [field]: value } }));
  const setFilters = (filters: Filters): void =>
    query.update((current) => ({ ...current, page: 1, filters: { ...current.filters, ...filters } }));
  const clearFilters = (): void => {
    searchTerm.set("");
    debouncedSearch.set("");
    query.update((current) => ({ ...current, page: 1, search: "", filters: {} }));
  };
  const onQuery = (patch: { page: number; limit: number; sort: string | null; dir: "asc" | "desc" }): void =>
    query.update((current) => ({ ...current, ...patch }));

  return {
    ref, query, searchTerm, setFilter, setFilters, clearFilters, onQuery,
    items: computed(() => data().items),
    count: computed(() => data().count),
    filters: computed(() => query().filters),
    tableQuery: computed(() => ({ page: query().page, limit: query().limit, sort: query().sort, dir: query().dir })),
    hasFilters: computed(() => query().search.trim() !== "" || Object.values(query().filters).some((value) => value != null && value !== "")),
    /** Cargando por primera vez: con datos ya en pantalla, una recarga no vuelve al esqueleto. */
    isLoading: computed(() => ref.isLoading() && ref.value().count === 0 && ref.status() !== "error"),
    isReloading: ref.isLoading,
    isError: computed(() => ref.error() != null),
  };
}
