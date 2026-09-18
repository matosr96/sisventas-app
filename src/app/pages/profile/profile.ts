import { Component, inject } from "@angular/core";
import { Layout } from "../../components/layout/layout";
import { ButtonCnt, HeaderPage, InputCnt } from "../../components/shared";
import { RoleName, roleLabel } from "../../entities";
import { changePassword } from "../../operations/user/change-password";
import { AuthStore } from "../../store/auth";

@Component({
  selector: "app-profile",
  imports: [Layout, HeaderPage, InputCnt, ButtonCnt],
  template: `
    <app-layout>
      <app-header-page title="Mi perfil" icon="bx-user-circle" [items]="['Inicio', 'Mi perfil']" [searchable]="false" />
      @if (auth.user(); as user) {
        <section class="grid">
          <article class="card">
            <h2 class="title">Datos</h2>
            <dl class="facts">
              <dt>Nombre</dt><dd>{{ user.firstName }} {{ user.lastName }}</dd>
              <dt>Usuario</dt><dd>{{ user.username }}</dd>
              <dt>Rol</dt><dd>{{ roleLabel(user.roles.includes(admin) ? admin : seller) }}</dd>
            </dl>
          </article>
          <form class="card" (submit)="op.submit($event)">
            <h2 class="title">Cambiar contraseña</h2>
            <app-input name="currentPassword" label="Contraseña actual" type="password" [(value)]="op.form.currentPassword" [required]="true" />
            <app-input name="newPassword" label="Contraseña nueva (mínimo 8)" type="password" [(value)]="op.form.newPassword" [required]="true" />
            <app-button [name]="op.pending() ? 'Guardando…' : 'Cambiar contraseña'" [disabled]="op.pending()" />
          </form>
        </section>
      }
    </app-layout>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; }
    .card { display: flex; flex-direction: column; gap: 1.6rem; padding: 2.4rem; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .title { font-size: 1.8rem; font-weight: 600; }
    .facts { display: grid; grid-template-columns: auto 1fr; gap: 0.8rem 2rem; }
    dt { color: var(--text-muted); } dd { font-weight: 500; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Profile {
  readonly auth = inject(AuthStore);
  readonly op = changePassword();
  readonly roleLabel = roleLabel;
  readonly admin = RoleName.ADMIN;
  readonly seller = RoleName.USER;
}
