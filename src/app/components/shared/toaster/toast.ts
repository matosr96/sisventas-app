import { Injectable, signal } from "@angular/core";

export type ToastTone = "success" | "error" | "warning";

export interface ToastAction { label: string; onClick: () => void; }

export interface ToastMessage {
  id: number;
  tone: ToastTone;
  text: string;
  action?: ToastAction;
  cancel?: ToastAction;
}

/** Avisos de resultado. Se disparan desde las operaciones (éxito/error), nunca desde componentes ni servicios. */
@Injectable({ providedIn: "root" })
export class Toast {
  readonly messages = signal<ToastMessage[]>([]);
  private next = 1;

  success(text: string): void { this.push("success", text); }
  error(text: string): void { this.push("error", text); }
  /** Aviso informativo que no bloquea nada (un tope alcanzado, un dato corregido). */
  notice(text: string): void { this.push("warning", text); }

  /** Confirmación destructiva: acción + cancelar. Nunca window.confirm. */
  warning(text: string, action: ToastAction, cancel?: ToastAction): void {
    this.push("warning", text, action, cancel ?? { label: "Cancelar", onClick: () => undefined }, 0);
  }

  dismiss(id: number): void {
    this.messages.update((list) => list.filter((message) => message.id !== id));
  }

  private push(tone: ToastTone, text: string, action?: ToastAction, cancel?: ToastAction, ttl = 4000): void {
    const id = this.next++;
    this.messages.update((list) => [...list, { id, tone, text, action, cancel }]);
    if (ttl > 0) setTimeout(() => this.dismiss(id), ttl);
  }
}
