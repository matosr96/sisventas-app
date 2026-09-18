import { Component } from "@angular/core";

@Component({
  selector: "app-loader",
  template: `<div class="loader" role="status" aria-label="Cargando"><span class="spinner"></span></div>`,
  styles: `
    .loader { display: flex; justify-content: center; padding: 6rem 0; }
    .spinner { width: 3.6rem; height: 3.6rem; border-radius: 50%; border: 3px solid var(--white-two); border-top-color: var(--blue-bg); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class Loader {}
