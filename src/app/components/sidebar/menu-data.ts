import { PrivateRoutes } from "../../constants";
import { RoleName, type RoleNameValue } from "../../entities";

export interface MenuItem { url: string; name: string; icon: string; roles: RoleNameValue[]; section?: string; }

const everyone: RoleNameValue[] = [RoleName.ADMIN, RoleName.USER];
const admins: RoleNameValue[] = [RoleName.ADMIN];

/** Ítems del menú con los roles que los ven, agrupados por sección. Mismo criterio que las rutas en app.routes.ts. */
export const menuItems: MenuItem[] = [
  { url: PrivateRoutes.HOME, name: "Inicio", icon: "bx-home-alt", roles: everyone },
  { url: PrivateRoutes.SALES, name: "Ventas", icon: "bx-receipt", roles: everyone, section: "Operación" },
  { url: PrivateRoutes.CLOSING, name: "Cierre de caja", icon: "bx-wallet", roles: everyone },
  { url: PrivateRoutes.PURCHASES, name: "Compras", icon: "bx-cart-download", roles: admins },
  { url: PrivateRoutes.PRODUCTS, name: "Productos", icon: "bx-package", roles: everyone, section: "Catálogo" },
  { url: PrivateRoutes.CATEGORIES, name: "Categorías", icon: "bx-category", roles: everyone },
  { url: PrivateRoutes.INVENTORY, name: "Inventario", icon: "bx-book", roles: everyone },
  { url: PrivateRoutes.SUPPLIERS, name: "Proveedores", icon: "bx-store", roles: admins },
  { url: PrivateRoutes.REPORTS, name: "Reportes", icon: "bx-bar-chart-alt-2", roles: everyone, section: "Análisis" },
  { url: PrivateRoutes.USERS, name: "Usuarios", icon: "bx-group", roles: admins, section: "Administración" },
  { url: PrivateRoutes.AUDITS, name: "Auditoría", icon: "bx-shield-quarter", roles: admins },
];
