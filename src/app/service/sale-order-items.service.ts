import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleOrderItems } from 'src/app/model/SaleOrderItems';

@Injectable({
  providedIn: 'root'
})
export class SaleOrderItemsService {

  private baseUrl = 'http://localhost:8080/iWarehouse-api/orderItems/';
  private url = '';

  constructor(private http: HttpClient) { }

  allOrderItems(orderId: number): Observable<SaleOrderItems> {
    this.url = this.baseUrl + 'getAllOrderItems.iwh:orderId=' + orderId;
    return this.http.get<SaleOrderItems>(this.url);
  }

  getOrderItem(itemSEQ: number): Observable<SaleOrderItems> {
      this.url = this.baseUrl + 'getOrderItem.iwh:Seq=' + itemSEQ;
      return this.http.get<SaleOrderItems>(this.url);
  }

  retrieveUnitPrice(orderId: number): Observable<SaleOrderItems> {   // NOT USED
    this.url = this.baseUrl + 'retrieveUnitPrice.iwh:Id=' + orderId;
    return this.http.get<SaleOrderItems>(this.url);
  }

  retrieveSalePrice(orderId: number): Observable<SaleOrderItems> {   // NOT USED
    this.url = this.baseUrl + 'retrieveSalePrice.iwh:Id=' + orderId;
    return this.http.get<SaleOrderItems>(this.url);
  }

  newOrderItem(SaleOrderItems: SaleOrderItems): Observable<SaleOrderItems> {
    this.url = this.baseUrl + 'addNewOrderItem.iwh'; 
    return this.http.post<SaleOrderItems>(this.url, SaleOrderItems);
  }

  updateOrderItem(SaleOrderItems: SaleOrderItems): Observable<SaleOrderItems> {
    this.url = this.baseUrl + 'updateOrderItem.iwh:Seq=' + SaleOrderItems.itemSEQ + '&soldQty=' + SaleOrderItems.soldQTY + '&unitPrice=' + SaleOrderItems.unitPrice + '&salePrice=' + SaleOrderItems.salePrice + '&taxableItem=' + SaleOrderItems.taxStatus; 
    return this.http.put<SaleOrderItems>(this.url, SaleOrderItems);
  }

  removeOrderItem(itemSEQ: number): Observable<SaleOrderItems> {
      this.url = this.baseUrl + 'removeOrderItem.iwh:Seq=' + itemSEQ;
      return this.http.delete<SaleOrderItems>(this.url);
  }

}
