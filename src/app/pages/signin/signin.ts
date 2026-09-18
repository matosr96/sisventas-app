import { Component } from "@angular/core";
import { ButtonCnt, InputCnt, Logo } from "../../components/shared";
import { signin } from "../../operations/auth/signin";

@Component({
  selector: "app-signin",
  imports: [InputCnt, ButtonCnt, Logo],
  templateUrl: "./signin.html",
  styleUrl: "./signin.css",
})
export class Signin {
  readonly op = signin();
}
