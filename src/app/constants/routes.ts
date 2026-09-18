// Rutas del router. Al añadir una se tocan tres archivos: aquí, app.routes.ts y sidebar/menu-data.ts.
export const PublicRoutes = {
  SIGNIN: "/ingresar",
} as const;

export const PrivateRoutes = {
  HOME: "/",
  PRODUCTS: "/productos",
  CATEGORIES: "/categorias",
  SUPPLIERS: "/proveedores",
  PURCHASES: "/compras",
  SALES: "/ventas",
  INVENTORY: "/inventario",
  REPORTS: "/reportes",
  CLOSING: "/cierre",
  AUDITS: "/auditoria",
  USERS: "/usuarios",
  PROFILE: "/perfil",
  FORBIDDEN: "/sin-permiso",
} as const;
