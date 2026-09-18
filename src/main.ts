import { bootstrapApplication } from "@angular/platform-browser";
import { loadRuntimeConfig } from "./app/api/api-config";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

// La URL de la API se resuelve antes de arrancar: ningún servicio la lee antes de tiempo.
loadRuntimeConfig()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
