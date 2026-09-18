import { Component, computed, input } from "@angular/core";

/**
 * Esqueleto de carga con la forma del contenido que viene (tabla, tarjetas, ficha o formulario).
 * Sustituye al spinner en la carga inicial de una pantalla: el usuario ve la estructura y no
 * un círculo girando. El spinner (app-loader) queda para acciones puntuales.
 */
@Component({
  selector: "app-skeleton",
  template: `
    <div class="skeleton" role="status" aria-label="Cargando" aria-live="polite">
      @switch (variant()) {
        @case ("cards") {
          <div class="cards">
            @for (item of items(); track item) { <div class="card"><span class="bone icon"></span><div class="stack"><span class="bone w40"></span><span class="bone w60 tall"></span></div></div> }
          </div>
        }
        @case ("detail") {
          <div class="stack gap"><span class="bone w30 tall"></span><span class="bone w50"></span></div>
          <div class="cards">
            @for (item of items(); track item) { <div class="card"><div class="stack"><span class="bone w40"></span><span class="bone w60 tall"></span></div></div> }
          </div>
          <div class="table">
            @for (item of lines(); track item) { <div class="line"><span class="bone w20"></span><span class="bone w40"></span><span class="bone w15"></span><span class="bone w15"></span></div> }
          </div>
        }
        @case ("form") {
          <div class="stack gap">
            @for (item of lines(); track item) { <span class="bone w30"></span><span class="bone full field"></span> }
          </div>
        }
        @default {
          <div class="table">
            <div class="line head"><span class="bone w20"></span><span class="bone w30"></span><span class="bone w15"></span><span class="bone w15"></span></div>
            @for (item of lines(); track item) { <div class="line"><span class="bone w20"></span><span class="bone w40"></span><span class="bone w15"></span><span class="bone w10"></span></div> }
          </div>
        }
      }
    </div>
  `,
  styles: `
    .skeleton { display: flex; flex-direction: column; gap: 2.4rem; }
    .bone { display: block; height: 1.2rem; border-radius: 0.6rem; background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%); background-size: 200% 100%; animation: shine 1.4s ease-in-out infinite; }
    .tall { height: 2rem; } .field { height: 3.8rem; border-radius: var(--radius-sm); }
    .w10 { width: 10%; } .w15 { width: 15%; } .w20 { width: 20%; } .w30 { width: 30%; } .w40 { width: 40%; } .w50 { width: 50%; } .w60 { width: 60%; } .full { width: 100%; }
    .icon { width: 5.2rem; height: 5.2rem; border-radius: var(--radius-sm); flex: none; }
    .stack { display: flex; flex-direction: column; gap: 0.8rem; flex: 1; }
    .gap { gap: 1.2rem; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.6rem; }
    .card { display: flex; align-items: center; gap: 1.6rem; padding: 2rem; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .table { background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); overflow: hidden; }
    .line { display: flex; gap: 2.4rem; align-items: center; padding: 1.4rem 1.6rem; border-bottom: 1px solid var(--border-color); }
    .line:last-child { border-bottom: none; }
    .head { background-color: var(--white-two); }
    @keyframes shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @media (prefers-reduced-motion: reduce) { .bone { animation: none; } }
    @media (max-width: 768px) { .cards { grid-template-columns: 1fr; } }
  `,
})
export class Skeleton {
  readonly variant = input<"table" | "cards" | "detail" | "form">("table");
  readonly rows = input(6);
  readonly count = input(4);
  readonly lines = computed(() => Array.from({ length: this.rows() }, (_, i) => i));
  readonly items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
