/** Parámetros comunes de todo listado del servidor. Los filtros propios van en `filters`. */
export interface ListQuery {
  page: number;
  limit: number;
  sort: string | null;
  dir: "asc" | "desc";
  search: string;
  filters: Record<string, string | null>;
}

export const EmptyQueryState: ListQuery = { page: 1, limit: 25, sort: null, dir: "desc", search: "", filters: {} };

/** Convierte la consulta en params HTTP omitiendo lo vacío: la API trata ausencia como "sin filtro". */
export const toParams = (query: ListQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = { page: query.page, limit: query.limit };
  if (query.sort) { params["sort"] = query.sort; params["dir"] = query.dir; }
  if (query.search.trim()) params["search"] = query.search.trim();
  for (const [key, value] of Object.entries(query.filters)) {
    if (value != null && value !== "") params[key] = value;
  }
  return params;
};
