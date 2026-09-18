import { Injectable, computed, inject, signal } from "@angular/core";
import { EmptySettingsState, type Settings } from "../entities";
import { SettingsApi } from "../services";
import { setCurrency } from "../utils";

/** Configuración del negocio (nombre, moneda, impuesto). Se carga al entrar y una vez por sesión. */
@Injectable({ providedIn: "root" })
export class SettingsStore {
  private readonly api = inject(SettingsApi);
  readonly settings = signal<Settings>(EmptySettingsState);
  readonly loaded = signal(false);
  readonly taxRate = computed(() => this.settings().taxRate);
  readonly currency = computed(() => this.settings().currency);
  readonly businessName = computed(() => this.settings().businessName);

  async load(): Promise<void> {
    try {
      const settings = await this.api.get();
      this.settings.set(settings);
      setCurrency(settings.currency);
      this.loaded.set(true);
    } catch {
      /* sin configuración: valores por defecto; la API lo dirá al usar el resto */
    }
  }
}
