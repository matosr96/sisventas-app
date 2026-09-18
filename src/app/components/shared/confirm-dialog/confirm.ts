import { Injectable, signal } from "@angular/core";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
}

interface PendingConfirm extends ConfirmOptions { resolve: (accepted: boolean) => void; }

/**
 * Confirmación modal con promesa: `if (await confirm.ask({...}))`. Sustituye al toast con
 * acción para lo destructivo: bloquea la pantalla, atrapa el foco y no caduca sola.
 */
@Injectable({ providedIn: "root" })
export class Confirm {
  readonly pending = signal<PendingConfirm | null>(null);

  ask(options: ConfirmOptions): Promise<boolean> {
    this.pending()?.resolve(false);
    return new Promise((resolve) => this.pending.set({ ...options, resolve }));
  }

  answer(accepted: boolean): void {
    const current = this.pending();
    this.pending.set(null);
    current?.resolve(accepted);
  }
}
