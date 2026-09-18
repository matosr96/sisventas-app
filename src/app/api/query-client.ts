import { Injectable } from "@angular/core";
import type { Resource } from "../constants";

interface Reloadable { reload(): void; }

/**
 * Registro de recursos vivos por clave. Tras una mutación, `invalidate(clave)` recarga todo
 * lo que esté mostrando ese recurso, sin banderas ni recargas a mano. Es el equivalente de
 * invalidar una query por prefijo: la clave es el recurso de la API.
 */
@Injectable({ providedIn: "root" })
export class QueryClient {
  private readonly byKey = new Map<string, Set<Reloadable>>();

  /** Devuelve la función para darse de baja; llamarla en DestroyRef.onDestroy. */
  register(key: Resource, resource: Reloadable): () => void {
    const set = this.byKey.get(key) ?? new Set<Reloadable>();
    set.add(resource);
    this.byKey.set(key, set);
    return () => set.delete(resource);
  }

  invalidate(...keys: Resource[]): void {
    for (const key of keys) {
      this.byKey.get(key)?.forEach((resource) => resource.reload());
    }
  }

  /** Todo lo que esté en pantalla: al volver a la pestaña, otro vendedor pudo mover el stock. */
  invalidateAll(): void {
    this.byKey.forEach((set) => set.forEach((resource) => resource.reload()));
  }
}
