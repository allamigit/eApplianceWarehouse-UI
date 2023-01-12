import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './component/stock/stock.component';
import { SaleOrderComponent } from './component/sale-order/sale-order.component';
import { SaleOrderItemsComponent } from './component/sale-order-items/sale-order-items.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { InfoComponent } from './component/info/info.component';
import { UserComponent } from './component/user/user.component';
import { AccessGroupComponent } from './component/access-group/access-group.component';
import { StockGuard } from './guard/stock.guard';
import { SaleOrderGuard } from './guard/sale-order.guard';
import { WelcomeGuard } from './guard/welcome.guard';
import { InfoGuard } from './guard/info.guard';
import { UserGuard } from './guard/user.guard';
import { AccessGroupGuard } from './guard/access-group.guard';

const routes: Routes = [
  {
    path: 'stock',
    component: StockComponent,
    canActivate: [StockGuard]
  },
  {
    path: 'sale-order',
    component: SaleOrderComponent,
    canActivate: [SaleOrderGuard]
  },
  {
    path: 'sale-order/:orderId',
    component: SaleOrderComponent,
    canActivate: [SaleOrderGuard]
  },
  {
    path: 'sale-order-items',
    component: SaleOrderItemsComponent,
    canActivate: [SaleOrderGuard]
  },
  {
    path: 'sale-order-items/:orderId',
    component: SaleOrderItemsComponent,
    canActivate: [SaleOrderGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [WelcomeGuard]
  },
  {
    path: 'info',
    component: InfoComponent,
    canActivate: [InfoGuard]
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'access-group',
    component: AccessGroupComponent,
    canActivate: [AccessGroupGuard]
  },
  {
    path: '**',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
