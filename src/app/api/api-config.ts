/**
 * Base URL de la API. Se lee de `config.json` ANTES de arrancar Angular (ver main.ts), así la
 * misma imagen sirve para cualquier entorno: en Docker el entrypoint la escribe desde `API_URL`.
 * Sin archivo (dev sin servidor) cae al valor local.
 */
const DEFAULT_API_URL = "http://localhost:8080/api/v1";

let apiUrlValue = DEFAULT_API_URL;

export interface RuntimeConfig { apiUrl: string; }

export const apiUrl = (): string => apiUrlValue;

export const setApiUrl = (url: string): void => { apiUrlValue = url.replace(/\/$/, ""); };

/** Carga config.json; cualquier fallo deja el valor por defecto y no impide arrancar. */
export async function loadRuntimeConfig(): Promise<void> {
  try {
    const response = await fetch("config.json", { cache: "no-store" });
    if (!response.ok) return;
    const config = (await response.json()) as Partial<RuntimeConfig>;
    if (config.apiUrl) setApiUrl(config.apiUrl);
  } catch {
    /* sin config.json: valor por defecto */
  }
}
