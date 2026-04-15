import { Routes } from '@angular/router';
import { PricesComponent } from './components/shared/prices/prices.component';
import { CartComponent } from './components/cart/cart.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)},
    {path:'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)},
   {path:'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children:[
        {path:'', redirectTo:'home', pathMatch:'full'},
        {path:'about-us', loadComponent: () => import('./components/about-us/about-us.component').then(m => m.AboutUsComponent)},
        {path:'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)},
        {path:'shop', loadComponent: () => import('./components/shop/shop.component').then(m => m.ShopComponent)},
        {path:'making-charges', loadComponent: () => import('./components/making-charges/making-charges.component').then(m => m.MakingChargesComponent)},
        {path:'gold-prices', loadComponent: () => import('./components/gold-prices/gold-prices.component').then(m => m.GoldPricesComponent)},
        { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent) },
        {path:'profile-orders', loadComponent:()=> import('./components/profile-orders/profile-orders.component').then(m=> m.ProfileOrdersComponent ) },
   {
  path: 'productDetails/:slug',
  loadComponent: () =>
    import('./components/product-details/product-details.component')
      .then(m => m.ProductDetailsComponent)
},{
  path: 'orders/:orderNumber',
  component: OrderDetailsComponent
}
    ]
   },
    {
  path: 'prices',
  component: PricesComponent
},
{
  path: 'shopping-cart',
  component: ShoppingCartComponent
},
 {path:'check-out', loadComponent: ()=>import('./components/check-out/check-out.component').then(m=> m.CheckOutComponent  ) },

];
