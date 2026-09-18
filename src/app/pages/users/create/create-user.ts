import { Component, input, output } from "@angular/core";
import { ButtonCnt, InputCnt, Modal } from "../../../components/shared";
import { createUser } from "../../../operations/user/create-user";

@Component({
  selector: "app-create-user",
  imports: [Modal, InputCnt, ButtonCnt],
  template: `
    <app-modal [open]="open()" title="Nuevo usuario" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <div class="row">
          <app-input name="firstName" label="Nombre" [(value)]="op.form.firstName" [required]="true" />
          <app-input name="lastName" label="Apellido" [(value)]="op.form.lastName" [required]="true" />
        </div>
        <app-input name="username" label="Usuario (mínimo 5 caracteres)" [(value)]="op.form.username" [required]="true" />
        <app-input name="password" label="Contraseña (mínimo 8 caracteres)" type="password" [(value)]="op.form.password" [required]="true" />
        <p class="hint">Nace como vendedor. Para hacerlo administrador, edítalo después.</p>
        <app-button [name]="op.pending() ? 'Creando…' : 'Crear usuario'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `.form { display: flex; flex-direction: column; gap: 1.6rem; } .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; } .hint { font-size: 1.3rem; color: var(--text-muted); } @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }`,
})
export class CreateUser {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();
  readonly op = createUser();
  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
}
