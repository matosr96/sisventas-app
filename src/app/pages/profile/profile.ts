import { Component, Injector, inject, runInInjectionContext, signal } from "@angular/core";
import { Layout } from "../../components/layout/layout";
import { ButtonCnt, HeaderPage, InputCnt } from "../../components/shared";
import { RoleName, roleLabel } from "../../entities";
import { logoutEverywhere } from "../../operations/session/logout-everywhere";
import { changePassword } from "../../operations/user/change-password";
import { updateProfile } from "../../operations/user/update-profile";
import { AuthStore } from "../../store/auth";
import { formatDateTime } from "../../utils";

@Component({
  selector: "app-profile",
  imports: [Layout, HeaderPage, InputCnt, ButtonCnt],
  template: `
    <app-layout>
      <app-header-page title="Mi perfil" icon="bx-user-circle" [items]="['Inicio', 'Mi perfil']" [searchable]="false"
        [badge]="roleLabel(auth.isAdmin() ? admin : seller)" [badgeTone]="auth.isAdmin() ? 'info' : 'neutral'" />
      @if (auth.user(); as user) {
        <section class="grid">
          <form class="card" (submit)="saveProfile($event)">
            <h2 class="title">Datos</h2>
            @if (user.photo) { <img class="photo" [src]="user.photo" alt="" /> }
            <p class="muted">Usuario <strong>{{ user.username }}</strong> · desde {{ formatDateTime(user.createdAt) }}</p>
            <app-input name="firstName" label="Nombre" [(value)]="profile.form.firstName" [required]="true" />
            <app-input name="lastName" label="Apellido" [(value)]="profile.form.lastName" [required]="true" />
            <app-input name="photo" label="Foto (URL, opcional)" [(value)]="profile.form.photo" placeholder="https://…" />
            <app-button [name]="profile.pending() ? 'Guardando…' : 'Guardar datos'" [disabled]="profile.pending()" />
          </form>
          <div class="stack">
            <form class="card" (submit)="password.submit($event)">
              <h2 class="title">Cambiar contraseña</h2>
              <app-input name="currentPassword" label="Contraseña actual" type="password" [(value)]="password.form.currentPassword" [required]="true" />
              <app-input name="newPassword" label="Contraseña nueva (mínimo 8)" type="password" [(value)]="password.form.newPassword" [required]="true" />
              <app-button [name]="password.pending() ? 'Guardando…' : 'Cambiar contraseña'" [disabled]="password.pending()" />
            </form>
            <section class="card">
              <h2 class="title">Sesiones</h2>
              <p class="muted">Tu sesión actual @if (auth.expiresAt(); as at) { caduca el {{ formatDateTime(isoOf(at)) }} }. Si dejaste una sesión abierta en otro equipo, ciérralas todas.</p>
              <app-button [name]="logout.pending() ? 'Cerrando…' : 'Cerrar sesión en todos los dispositivos'" type="button" variant="danger" icon="bx-log-out-circle" [disabled]="logout.pending()" (clicked)="logout.run()" />
            </section>
          </div>
        </section>
      }
    </app-layout>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; align-items: start; }
    .stack { display: flex; flex-direction: column; gap: 1.6rem; }
    .card { display: flex; flex-direction: column; gap: 1.6rem; padding: 2.4rem; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .title { font-size: 1.8rem; font-weight: 600; }
    .photo { width: 8rem; height: 8rem; border-radius: 50%; object-fit: cover; background-color: var(--white-two); }
    .muted { color: var(--text-muted); font-size: 1.3rem; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Profile {
  readonly auth = inject(AuthStore);
  private readonly injector = inject(Injector);
  readonly password = changePassword();
  readonly logout = logoutEverywhere();
  readonly roleLabel = roleLabel;
  readonly formatDateTime = formatDateTime;
  readonly admin = RoleName.ADMIN;
  readonly seller = RoleName.USER;
  readonly saved = signal(false);
  profile = runInInjectionContext(this.injector, () => updateProfile(this.auth.user() ?? { id: 0, firstName: "", lastName: "", photo: null, username: "", roles: [], status: "ACTIVE", createdAt: "" }));

  isoOf(at: number): string { return new Date(at).toISOString(); }
  async saveProfile(event: Event): Promise<void> { this.saved.set(await this.profile.submit(event)); }
}
