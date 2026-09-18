import type { Routes } from "@angular/router";
import { PrivateRoutes, PublicRoutes } from "./constants";
import { RoleName } from "./entities";
import { authGuard, roleGuard } from "./guards";
import { Categories } from "./pages/categories/categories";
import { Home } from "./pages/home/home";
import { NotFound } from "./pages/not-found/not-found";
import { ProductDetail } from "./pages/products/detail/product-detail";
import { Products } from "./pages/products/products";
import { Profile } from "./pages/profile/profile";
import { PurchaseDetail } from "./pages/purchases/detail/purchase-detail";
import { NewPurchase } from "./pages/purchases/new/new-purchase";
import { Purchases } from "./pages/purchases/purchases";
import { SaleDetail } from "./pages/sales/detail/sale-detail";
import { NewSale } from "./pages/sales/new/new-sale";
import { Sales } from "./pages/sales/sales";
import { Signin } from "./pages/signin/signin";
import { Suppliers } from "./pages/suppliers/suppliers";
import { Users } from "./pages/users/users";

const path = (route: string): string => route.replace(/^\//, "");

/** Los permisos viven aquí y en el menú (sidebar/menu-data.ts): las pantallas no los repiten. */
export const routes: Routes = [
  { path: path(PublicRoutes.SIGNIN), component: Signin },
  {
    path: "",
    canActivateChild: [authGuard],
    children: [
      { path: "", component: Home },
      { path: path(PrivateRoutes.PROFILE), component: Profile },
      { path: path(PrivateRoutes.PRODUCTS), component: Products },
      { path: `${path(PrivateRoutes.PRODUCTS)}/:id`, component: ProductDetail },
      { path: path(PrivateRoutes.CATEGORIES), component: Categories },
      { path: path(PrivateRoutes.SALES), component: Sales },
      { path: `${path(PrivateRoutes.SALES)}/nueva`, component: NewSale },   // antes que :id — "nueva" no es el id de nadie
      { path: `${path(PrivateRoutes.SALES)}/:id`, component: SaleDetail },
      {
        path: "",
        canActivateChild: [roleGuard(RoleName.ADMIN)],
        children: [
          { path: path(PrivateRoutes.SUPPLIERS), component: Suppliers },
          { path: path(PrivateRoutes.PURCHASES), component: Purchases },
          { path: `${path(PrivateRoutes.PURCHASES)}/nueva`, component: NewPurchase },
          { path: `${path(PrivateRoutes.PURCHASES)}/:id`, component: PurchaseDetail },
          { path: path(PrivateRoutes.USERS), component: Users },
        ],
      },
    ],
  },
  { path: "**", component: NotFound },
];
