import { HttpErrorResponse } from "@angular/common/http";
import { DEFAULT_ERROR_MESSAGE, ErrorMessages } from "../constants";

/** Código de dominio de la respuesta, o null si no es un error de la API. */
export const apiErrorCode = (error: unknown): string | null =>
  error instanceof HttpErrorResponse ? (error.error as { message?: string } | null)?.message ?? null : null;

/** Traduce el { message: "<código>" } de la API a un texto en español para el toast. */
export const apiErrorMessage = (error: unknown): string => {
  if (error instanceof HttpErrorResponse) {
    const code = (error.error as { message?: string } | null)?.message;
    if (code && ErrorMessages[code]) return ErrorMessages[code];
    if (error.status === 0) return "No hay conexión con el servidor.";
  }
  return DEFAULT_ERROR_MESSAGE;
};
