import { Component, computed, signal } from "@angular/core";
import { Empty, Table, badge, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { FilterChips, HeaderPage, Skeleton, type FilterOption } from "../../components/shared";
import { ScreenName } from "../../constants";
import { RoleName, UserStatus, roleLabel, userStatusLabel, type User } from "../../entities";
import { listUsers } from "../../operations/user/list-users";
import { CreateUser } from "./create/create-user";
import { UpdateUser } from "./update/update-user";

@Component({
  selector: "app-users",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, FilterChips, CreateUser, UpdateUser],
  templateUrl: "./users.html",
  styleUrl: "./users.css",
})
export class Users {
  readonly screen = ScreenName.USER;
  readonly list = listUsers();
  readonly creating = signal(false);
  readonly editing = signal<User | null>(null);
  readonly statusOptions: FilterOption[] = [
    { value: UserStatus.ACTIVE, label: "Activos" }, { value: UserStatus.INACTIVE, label: "Inactivos" },
  ];
  readonly statusFilter = computed(() => this.list.filters()["status"] ?? null);
  readonly rows = computed<Row[]>(() =>
    this.list.items().map((user) => {
      const isAdmin = user.roles.includes(RoleName.ADMIN);
      return {
        ...user,
        name: `${user.firstName} ${user.lastName}`,
        roleCell: badge(roleLabel(isAdmin ? RoleName.ADMIN : RoleName.USER), isAdmin ? "info" : "neutral"),
        statusCell: badge(userStatusLabel(user.status), user.status === UserStatus.ACTIVE ? "ok" : "neutral"),
      };
    })
  );

  edit(row: Row): void { this.editing.set(this.list.items().find((user) => user.id === row["id"]) ?? null); }
}
