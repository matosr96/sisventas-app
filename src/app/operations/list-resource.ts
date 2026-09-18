import { DestroyRef, computed, inject, resource, type ResourceRef, type Signal } from "@angular/core";
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
