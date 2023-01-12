import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleOrder } from 'src/app/model/SaleOrder';

export interface LastSEQ {
  'id': number;
  'orderId': number;
}

@Injectable({
  providedIn: 'root'
})

export class SaleOrderService {

  private baseUrl = 'http://localhost:8080/iWarehouse-api/order/';
  private url = '';

  constructor(private http: HttpClient) { }

  allOrders(): Observable<SaleOrder> {
    this.url = this.baseUrl + 'listAllOrders.iwh';
    return this.http.get<SaleOrder>(this.url);
  }

  todayOrders(): Observable<SaleOrder> {
    this.url = this.baseUrl + 'listTodayOrders.iwh';
    return this.http.get<SaleOrder>(this.url);
  }

  dateRangeOrders(dateFrom: string, dateTo: string): Observable<SaleOrder> {
    this.url = this.baseUrl + 'listDateRangeOrders.iwh:From=' + dateFrom + '&To=' + dateTo;
    return this.http.get<SaleOrder>(this.url);
  }

  getOrderById(orderId: number): Observable<SaleOrder> {
    this.url = this.baseUrl + 'getOrder.iwh:Id=' + orderId;
    return this.http.get<SaleOrder>(this.url);
  }

  getOrdersByCustomerName(customerName: string): Observable<SaleOrder> {
    this.url = this.baseUrl + 'getOrders.iwh:customerName=' + customerName;
    return this.http.get<SaleOrder>(this.url);
  }

  getOrdersByCreatedUser(createdUser: string): Observable<SaleOrder> {
    this.url = this.baseUrl + 'getOrders.iwh:createdUser=' + createdUser;
    return this.http.get<SaleOrder>(this.url);
  }

  getOrdersByCustomerNameAndCreatedUser(customerName: string, createdUser: string): Observable<SaleOrder> {   // NOT USED
    this.url = this.baseUrl + 'getOrders.iwh:customerName=' + customerName + '&createdUser=' + createdUser;
    return this.http.get<SaleOrder>(this.url);
  }

  getOrdersForStockItem(itemId: number): Observable<SaleOrder> {
    this.url = this.baseUrl + 'getOrders.iwh:itemId=' + itemId;
    return this.http.get<SaleOrder>(this.url);
  }

  newOrder(saleOrder: SaleOrder): Observable<SaleOrder> {
    this.url = this.baseUrl + 'addNewOrder.iwh'; 
    return this.http.post<SaleOrder>(this.url, saleOrder);
  }

  updateOrder(saleOrder: SaleOrder): Observable<SaleOrder> {
    this.url = this.baseUrl + 'updateOrder.iwh:Id=' + saleOrder.orderId; 
    return this.http.put<SaleOrder>(this.url, saleOrder);
  }

  cancelOrder(orderId: number): Observable<SaleOrder> {
    this.url = this.baseUrl + 'cancelOrder.iwh:Id=' + orderId;
    return this.http.delete<SaleOrder>(this.url);
  }

}
