import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { StockService } from './service/stock.service';
import { SaleOrderService } from './service/sale-order.service';
import { SaleOrderItemsService } from './service/sale-order-items.service';
import { UserService } from './service/user.service';
import { AccessGroupService } from './service/access-group.service';
import { LoginService } from './service/login.service';
import { StockComponent } from './component/stock/stock.component';
import { SaleOrderComponent } from './component/sale-order/sale-order.component';
import { SaleOrderItemsComponent } from './component/sale-order-items/sale-order-items.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { UserComponent } from './component/user/user.component';
import { AccessGroupComponent } from './component/access-group/access-group.component';
import { InfoComponent } from './component/info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    StockComponent,
    SaleOrderComponent,
    SaleOrderItemsComponent,
    WelcomeComponent,
    UserComponent,
    AccessGroupComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    StockService,
    SaleOrderService,
    SaleOrderItemsService,
    UserService,
    AccessGroupService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
