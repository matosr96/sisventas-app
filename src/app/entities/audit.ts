import type { ListState } from "./list-state";

/** Escritura registrada por la API: quién, qué método y qué recurso. Nunca el cuerpo. */
export interface Audit {
  id: number;
  username: string;
  method: string;
  resource: string;
  detail: string | null;
  createdAt: string;
}

export const EmptyAuditsState: ListState<Audit> = { count: 0, page: 0, pages: 0, items: [] };
