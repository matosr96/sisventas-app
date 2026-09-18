// Rutas del router. Al añadir una se tocan tres archivos: aquí, app.routes.ts y header/menu-data.ts.
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
  USERS: "/usuarios",
  PROFILE: "/perfil",
} as const;
