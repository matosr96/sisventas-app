import { Injectable, computed, effect, signal } from "@angular/core";
import { RoleName, type Session, type User } from "../entities";

const STORAGE_KEY = "auth";

interface PersistedAuth { token: string; user: User | null; }

const EMPTY: PersistedAuth = { token: "", user: null };

const read = (): PersistedAuth => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<PersistedAuth>) } : EMPTY;
  } catch {
    return EMPTY; // almacenamiento bloqueado o JSON corrupto: sesión vacía
  }
};

/** Caducidad (`exp`, en segundos) leída del JWT sin verificarlo: solo sirve para avisar y cerrar a tiempo. */
export const tokenExpiresAt = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

/**
 * Sesión del usuario. Único estado global de cliente junto con UiStore y SettingsStore; siempre se consume por señal.
 *
 * El token se guarda en localStorage a sabiendas: es un SPA sin backend intermedio (BFF), así que
 * una cookie httpOnly obligaría a la API a emitir sesión por cookie con CSRF y CORS con credenciales.
 * La defensa contra XSS está en no inyectar HTML (Angular sanitiza), en la CSP que sirve nginx y en
 * que el token caduca y puede invalidarse en todos los dispositivos. Ver "Security notes" en el README.
 */
@Injectable({ providedIn: "root" })
export class AuthStore {
  private readonly initial = read();
  readonly token = signal<string>(this.initial.token);
  readonly user = signal<User | null>(this.initial.user);

  readonly expiresAt = computed(() => (this.token() ? tokenExpiresAt(this.token()) : null));
  readonly isAuthenticated = computed(() => this.token() !== "" && (this.expiresAt() === null || this.expiresAt()! > Date.now()));
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
