import { Injectable, computed, effect, signal } from "@angular/core";
import { RoleName, type Session, type User } from "../entities";

const STORAGE_KEY = "auth";

interface PersistedAuth { token: string; user: User | null; }

const read = (): PersistedAuth => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "") as PersistedAuth;
  } catch {
    return { token: "", user: null };
  }
};

/** Sesión del usuario. Único estado global de cliente junto con UiStore; siempre se consume por señal. */
@Injectable({ providedIn: "root" })
export class AuthStore {
  private readonly initial = read();
  readonly token = signal<string>(this.initial.token);
  readonly user = signal<User | null>(this.initial.user);

  readonly isAuthenticated = computed(() => this.token() !== "");
  readonly roles = computed(() => this.user()?.roles ?? []);
  readonly isAdmin = computed(() => this.roles().includes(RoleName.ADMIN));
  readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : "";
  });

  constructor() {
    effect(() => {
      const persisted: PersistedAuth = { token: this.token(), user: this.user() };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)); } catch { /* sin almacenamiento */ }
    });
  }

  setSession(session: Session): void {
    this.token.set(session.accessToken);
    this.user.set(session.user);
  }

  /** Tras cambiar roles o datos propios, refrescar el usuario en sesión sin pedir otro token. */
  setUser(user: User): void { this.user.set(user); }

  logout(): void {
    this.token.set("");
    this.user.set(null);
  }
}
