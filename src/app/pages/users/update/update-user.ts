import { Component, Injector, inject, input, output, runInInjectionContext, type OnInit } from "@angular/core";
import { ButtonCnt, Modal, SelectCpt, type SelectOption } from "../../../components/shared";
import { RoleName, UserStatus, type RoleNameValue, type User, type UserStatusValue } from "../../../entities";
import { updateUser } from "../../../operations/user/update-user";

@Component({
  selector: "app-update-user",
  imports: [Modal, SelectCpt, ButtonCnt],
  template: `
    <app-modal [open]="true" [title]="'Editar ' + user().username" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <app-select name="role" label="Rol" [options]="roleOptions" [(value)]="op.form.role" [required]="true" />
        <app-select name="status" label="Estado" [options]="statusOptions" [(value)]="op.form.status" [required]="true" />
        <p class="hint">Una cuenta inactiva no puede entrar ni seguir usando su sesión. No puedes cambiarte a ti mismo.</p>
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar cambios'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `.form { display: flex; flex-direction: column; gap: 1.6rem; } .hint { font-size: 1.3rem; color: var(--text-muted); }`,
})
export class UpdateUser implements OnInit {
  readonly user = input.required<User>();
  readonly closed = output<void>();
  readonly roleOptions: SelectOption<RoleNameValue>[] = [
    { value: RoleName.USER, label: "Vendedor" }, { value: RoleName.ADMIN, label: "Administrador" },
  ];
  readonly statusOptions: SelectOption<UserStatusValue>[] = [
    { value: UserStatus.ACTIVE, label: "Activo" }, { value: UserStatus.INACTIVE, label: "Inactivo" },
  ];
  private readonly injector = inject(Injector);
  op!: ReturnType<typeof updateUser>;

  /** El input requerido no existe en el constructor: la operación se construye aquí, con el registro ya enlazado. */
  ngOnInit(): void {
    this.op = runInInjectionContext(this.injector, () => updateUser(this.user()));
  }

  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
}
