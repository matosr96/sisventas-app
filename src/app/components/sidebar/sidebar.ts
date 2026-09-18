import { Component, computed, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { PrivateRoutes, PublicRoutes } from "../../constants";
import { AuthStore } from "../../store/auth";
import { UiStore } from "../../store/ui";
import { Logo } from "../shared/logo/logo";
import { ThemeToggle } from "../shared/theme-toggle/theme-toggle";
import { menuItems } from "./menu-data";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive, Logo, ThemeToggle],
  templateUrl: "./sidebar.html",
  styleUrl: "./sidebar.css",
})
export class Sidebar {
  readonly auth = inject(AuthStore);
  readonly ui = inject(UiStore);
  private readonly router = inject(Router);

  readonly profileRoute = PrivateRoutes.PROFILE;
  readonly items = computed(() => menuItems.filter((item) => item.roles.some((role) => this.auth.roles().includes(role))));

  logout(): void {
    this.auth.logout();
    void this.router.navigate([PublicRoutes.SIGNIN]);
  }
}
