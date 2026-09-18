import { Component, Injector, inject, input, output, runInInjectionContext, signal, type OnInit } from "@angular/core";
import { ButtonCnt, InputCnt, Modal, SelectCpt, type SelectOption } from "../../../components/shared";
import { RoleName, UserStatus, type RoleNameValue, type User, type UserStatusValue } from "../../../entities";
import { resetUserPassword } from "../../../operations/user/reset-user-password";
import { updateUser } from "../../../operations/user/update-user";
import { AuthStore } from "../../../store/auth";

@Component({
  selector: "app-update-user",
  imports: [Modal, InputCnt, SelectCpt, ButtonCnt],
  template: `
    <app-modal [open]="true" variant="drawer" [title]="'Editar ' + user().username" [subtitle]="user().firstName + ' ' + user().lastName" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <div class="row">
          <app-input name="firstName" label="Nombre" [(value)]="op.form.firstName" [required]="true" />
          <app-input name="lastName" label="Apellido" [(value)]="op.form.lastName" [required]="true" />
        </div>
        <app-input name="photo" label="Foto (URL, opcional)" [(value)]="op.form.photo" placeholder="https://…" />
        <div class="row">
          <app-select name="role" label="Rol" [options]="roleOptions" [(value)]="op.form.role" [required]="true" />
          <app-select name="status" label="Estado" [options]="statusOptions" [(value)]="op.form.status" [required]="true" />
        </div>
        <p class="hint">Una cuenta inactiva no puede entrar ni seguir usando su sesión. No puedes cambiarte a ti mismo.</p>
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar cambios'" [disabled]="op.pending()" />
      </form>
      @if (!isSelf()) {
        <section class="reset">
          <h3 class="reset_title">Reiniciar contraseña</h3>
          @if (!resetting()) {
            <p class="hint">Para cuando la olvidó: se fija una nueva sin pedir la actual y se cierran sus sesiones abiertas.</p>
            <app-button name="Reiniciar contraseña" type="button" variant="ghost" icon="bx-key" (clicked)="resetting.set(true)" />
          } @else {
            <form class="form" (submit)="reset($event)">
              <app-input name="newPassword" label="Contraseña nueva (mínimo 8 caracteres)" type="password" [(value)]="resetter.form.newPassword" [required]="true" />
              <div class="row">
                <app-button name="Cancelar" type="button" variant="ghost" (clicked)="resetting.set(false)" />
                <app-button [name]="resetter.pending() ? 'Guardando…' : 'Fijar contraseña'" variant="danger" [disabled]="resetter.pending()" />
              </div>
            </form>
          }
        </section>
      }
    </app-modal>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 1.6rem; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; }
    .hint { font-size: 1.3rem; color: var(--text-muted); }
    .reset { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 2.4rem; padding-top: 2rem; border-top: 1px solid var(--border-color); }
    .reset_title { font-size: 1.5rem; font-weight: 600; }
    @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }
  `,
})
export class UpdateUser implements OnInit {
  readonly user = input.required<User>();
  readonly closed = output<void>();
  readonly resetting = signal(false);
  readonly roleOptions: SelectOption<RoleNameValue>[] = [
    { value: RoleName.USER, label: "Vendedor" }, { value: RoleName.ADMIN, label: "Administrador" },
  ];
  readonly statusOptions: SelectOption<UserStatusValue>[] = [
    { value: UserStatus.ACTIVE, label: "Activo" }, { value: UserStatus.INACTIVE, label: "Inactivo" },
  ];
  private readonly injector = inject(Injector);
  private readonly auth = inject(AuthStore);
  op!: ReturnType<typeof updateUser>;
  resetter!: ReturnType<typeof resetUserPassword>;

  isSelf(): boolean { return this.auth.user()?.id === this.user().id; }

  /** El input requerido no existe en el constructor: las operaciones se construyen aquí, con el registro ya enlazado. */
  ngOnInit(): void {
    this.op = runInInjectionContext(this.injector, () => updateUser(this.user()));
    this.resetter = runInInjectionContext(this.injector, () => resetUserPassword(this.user().id));
  }

  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
  async reset(event: Event): Promise<void> { if (await this.resetter.submit(event)) this.resetting.set(false); }
}
