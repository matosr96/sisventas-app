import { Component, input, output } from "@angular/core";
import { ButtonCnt, InputCnt, Modal, SelectCpt, type SelectOption } from "../../../components/shared";
import { RoleName, type RoleNameValue } from "../../../entities";
import { createUser } from "../../../operations/user/create-user";

@Component({
  selector: "app-create-user",
  imports: [Modal, InputCnt, SelectCpt, ButtonCnt],
  template: `
    <app-modal [open]="open()" variant="drawer" title="Nuevo usuario" subtitle="Alta directa por administrador, con su rol de entrada." (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <div class="row">
          <app-input name="firstName" label="Nombre" [(value)]="op.form.firstName" [required]="true" />
          <app-input name="lastName" label="Apellido" [(value)]="op.form.lastName" [required]="true" />
        </div>
        <app-input name="username" label="Usuario (mínimo 5 caracteres)" [(value)]="op.form.username" [required]="true" />
        <app-input name="password" label="Contraseña (mínimo 8 caracteres)" type="password" [(value)]="op.form.password" [required]="true" />
        <app-select name="role" label="Rol" [options]="roleOptions" [(value)]="op.form.role" [required]="true" />
        <app-input name="photo" label="Foto (URL, opcional)" [(value)]="op.form.photo" placeholder="https://…" />
        <app-button [name]="op.pending() ? 'Creando…' : 'Crear usuario'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `.form { display: flex; flex-direction: column; gap: 1.6rem; } .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; } @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }`,
})
export class CreateUser {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();
  readonly op = createUser();
  readonly roleOptions: SelectOption<RoleNameValue>[] = [
    { value: RoleName.USER, label: "Vendedor" }, { value: RoleName.ADMIN, label: "Administrador" },
  ];
  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
}
