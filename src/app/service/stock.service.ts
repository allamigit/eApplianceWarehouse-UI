import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/model/Stock';

@Injectable({
  providedIn: 'root'
})

export class StockService {

  private baseUrl = 'http://localhost:8080/iWarehouse-api/stock/';
  private url = '';

  constructor(private http: HttpClient) { }

  allStockItems(): Observable<Stock> {
    this.url = this.baseUrl + 'listAllStockItems.iwh';
    return this.http.get<Stock>(this.url);
  }

  activeStockItems(): Observable<Stock> {
    this.url = this.baseUrl + 'listActiveStockItems.iwh';
    return this.http.get<Stock>(this.url);
  }

  inactiveStockItems(): Observable<Stock> {
    this.url = this.baseUrl + 'listInactiveStockItems.iwh';
    return this.http.get<Stock>(this.url);
  }

  getItemById(itemId: number): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'getStockItem.iwh:Id=' + itemId;
    return this.http.get<Stock>(this.url);
  }

  /*getItemById(itemId: number): Promise<Stock> {  // *****
    this.url = this.baseUrl + 'getStockItem.iwh:Id=' + itemId;
    return new Promise(resolve => this.http.get<Stock>(this.url)).then();
  }*/

  getItemByName(itemName: string): Observable<Stock> {
    this.url = this.baseUrl + 'listAllStockItems.iwh:Contains=' + itemName;
    return this.http.get<Stock>(this.url);
  }

  getActiveItemByName(itemName: string): Observable<Stock> {
    this.url = this.baseUrl + 'listActiveStockItems.iwh:Contains=' + itemName;
    return this.http.get<Stock>(this.url);
  }

  getItemCount(itemId: number) {
    this.url = this.baseUrl + 'count/' + itemId;
    return this.http.get(this.url);
  }

  newStockItem(stock: Stock): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'addNewStockItem.iwh'; 
    return this.http.post<Stock>(this.url, stock);
  }

  updateStockItem(stock: Stock): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'updateStockItem.iwh:Id=' + stock.itemId; 
    return this.http.put<Stock>(this.url, stock);
  }

  updateSellingPrice(stock: Stock, percent: number): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'updateSellingPrice.iwh:Id=' + stock.itemId + '&Percent=' + percent; 
    return this.http.put<Stock>(this.url, stock);
  }

  updateSalePrice(stock: Stock, percent: number): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'updateSalePrice.iwh:Id=' + stock.itemId + '&Percent=' + percent; 
    return this.http.put<Stock>(this.url, stock);
  }

  saveSellingPrice(stock: Stock, sellingPrice: number): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'saveSellingPrice.iwh:Id=' + stock.itemId + '&Selling=' + sellingPrice; 
    return this.http.put<Stock>(this.url, stock);
  }

  saveSalePrice(stock: Stock, salePrice: number): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'saveSalePrice.iwh:Id=' + stock.itemId + '&Sale=' + salePrice; 
    return this.http.put<Stock>(this.url, stock);
  }

  deleteStockItem(itemId: number): Observable<Stock> {  // *****
    this.url = this.baseUrl + 'deleteStockItem.iwh:Id=' + itemId;
    return this.http.delete<Stock>(this.url);
  }  

}
