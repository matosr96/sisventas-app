import { Injectable, effect, signal } from "@angular/core";

export const ThemeModes = { LIGHT: "light", DARK: "dark", SYSTEM: "system" } as const;
export type ThemeMode = (typeof ThemeModes)[keyof typeof ThemeModes];

const STORAGE_KEY = "ui";

interface PersistedUi { theme: ThemeMode; sidebarCollapsed: boolean; }

const read = (): PersistedUi => {
  try {
    return { theme: ThemeModes.SYSTEM, sidebarCollapsed: false, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Partial<PersistedUi>) };
  } catch {
    return { theme: ThemeModes.SYSTEM, sidebarCollapsed: false };
  }
};

/** Preferencias de interfaz: tema y sidebar. Se aplican al <html> desde aquí y siguen al sistema en vivo. */
@Injectable({ providedIn: "root" })
export class UiStore {
  private readonly initial = read();
  readonly theme = signal<ThemeMode>(this.initial.theme);
  readonly sidebarCollapsed = signal<boolean>(this.initial.sidebarCollapsed);
  readonly sidebarOpen = signal<boolean>(false); // solo móvil

  private readonly media = window.matchMedia("(prefers-color-scheme: dark)");

  constructor() {
    effect(() => {
      const persisted: PersistedUi = { theme: this.theme(), sidebarCollapsed: this.sidebarCollapsed() };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)); } catch { /* sin almacenamiento */ }
      this.apply();
    });
    this.media.addEventListener("change", () => this.apply());
  }

  setTheme(theme: ThemeMode): void { this.theme.set(theme); }
  toggleSidebar(): void { this.sidebarCollapsed.update((value) => !value); }
  openSidebar(): void { this.sidebarOpen.set(true); }
  closeSidebar(): void { this.sidebarOpen.set(false); }

  isDark(): boolean {
    const theme = this.theme();
    return theme === ThemeModes.DARK || (theme === ThemeModes.SYSTEM && this.media.matches);
  }

  private apply(): void {
    document.documentElement.setAttribute("data-theme", this.isDark() ? "dark" : "light");
  }
}
