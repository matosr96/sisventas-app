import { Component, computed, signal } from "@angular/core";
import { Empty, Table, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, Loader } from "../../components/shared";
import { ScreenName } from "../../constants";
import { roleLabel, userStatusLabel, RoleName, type User } from "../../entities";
import { listUsers } from "../../operations/user/list-users";
import { CreateUser } from "./create/create-user";
import { UpdateUser } from "./update/update-user";

@Component({
  selector: "app-users",
  imports: [Layout, HeaderPage, Loader, Table, Empty, CreateUser, UpdateUser],
  templateUrl: "./users.html",
  styleUrl: "./users.css",
})
export class Users {
  readonly screen = ScreenName.USER;
  readonly list = listUsers();
  readonly creating = signal(false);
  readonly editing = signal<User | null>(null);
  readonly rows = computed<Row[]>(() =>
    this.list.filtered().map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      roleLabel: roleLabel(user.roles.includes(RoleName.ADMIN) ? RoleName.ADMIN : RoleName.USER),
      statusLabel: userStatusLabel(user.status),
    }))
  );

  edit(row: Row): void { this.editing.set(this.list.items().find((user) => user.id === row["id"]) ?? null); }
}
