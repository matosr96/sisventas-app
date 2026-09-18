import type { Routes } from "@angular/router";
import { PrivateRoutes, PublicRoutes } from "./constants";
import { RoleName } from "./entities";
import { authGuard, roleGuard } from "./guards";
import { Audits } from "./pages/audits/audits";
import { Categories } from "./pages/categories/categories";
import { CashClosingPage } from "./pages/closing/closing";
import { Forbidden } from "./pages/forbidden/forbidden";
import { Home } from "./pages/home/home";
import { Inventory } from "./pages/inventory/inventory";
import { NotFound } from "./pages/not-found/not-found";
import { ProductDetail } from "./pages/products/detail/product-detail";
import { Products } from "./pages/products/products";
import { Profile } from "./pages/profile/profile";
import { PurchaseDetail } from "./pages/purchases/detail/purchase-detail";
import { NewPurchase } from "./pages/purchases/new/new-purchase";
import { Purchases } from "./pages/purchases/purchases";
import { Reports } from "./pages/reports/reports";
import { SaleDetail } from "./pages/sales/detail/sale-detail";
import { NewSale } from "./pages/sales/new/new-sale";
import { Sales } from "./pages/sales/sales";
import { Signin } from "./pages/signin/signin";
import { Suppliers } from "./pages/suppliers/suppliers";
import { Users } from "./pages/users/users";

const path = (route: string): string => route.replace(/^\//, "");

/** Los permisos viven aquí y en el menú (sidebar/menu-data.ts): las pantallas no los repiten. Cada ruta declara su título. */
export const routes: Routes = [
  { path: path(PublicRoutes.SIGNIN), component: Signin, title: "Ingresar" },
  {
    path: "",
    canActivateChild: [authGuard],
    children: [
      { path: "", component: Home, title: "Inicio" },
      { path: path(PrivateRoutes.PROFILE), component: Profile, title: "Mi perfil" },
      { path: path(PrivateRoutes.PRODUCTS), component: Products, title: "Productos" },
      { path: `${path(PrivateRoutes.PRODUCTS)}/:id`, component: ProductDetail, title: "Producto" },
      { path: path(PrivateRoutes.CATEGORIES), component: Categories, title: "Categorías" },
      { path: path(PrivateRoutes.SALES), component: Sales, title: "Ventas" },
      { path: `${path(PrivateRoutes.SALES)}/nueva`, component: NewSale, title: "Registrar venta" },   // antes que :id — "nueva" no es el id de nadie
      { path: `${path(PrivateRoutes.SALES)}/:id`, component: SaleDetail, title: "Factura" },
      { path: path(PrivateRoutes.INVENTORY), component: Inventory, title: "Inventario" },
      { path: path(PrivateRoutes.REPORTS), component: Reports, title: "Reportes" },
      { path: path(PrivateRoutes.CLOSING), component: CashClosingPage, title: "Cierre de caja" },
      { path: path(PrivateRoutes.FORBIDDEN), component: Forbidden, title: "Sin permiso" },
      {
        path: "",
        canActivateChild: [roleGuard(RoleName.ADMIN)],
        children: [
          { path: path(PrivateRoutes.SUPPLIERS), component: Suppliers, title: "Proveedores" },
          { path: path(PrivateRoutes.PURCHASES), component: Purchases, title: "Compras" },
          { path: `${path(PrivateRoutes.PURCHASES)}/nueva`, component: NewPurchase, title: "Registrar compra" },
          { path: `${path(PrivateRoutes.PURCHASES)}/:id`, component: PurchaseDetail, title: "Compra" },
          { path: path(PrivateRoutes.USERS), component: Users, title: "Usuarios" },
          { path: path(PrivateRoutes.AUDITS), component: Audits, title: "Auditoría" },
        ],
      },
    ],
  },
  { path: "**", component: NotFound, title: "Página no encontrada" },
];
