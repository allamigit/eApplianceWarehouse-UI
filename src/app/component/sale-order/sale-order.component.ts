import { Component, Input, Output, OnInit, EventEmitter, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleOrder } from 'src/app/model/SaleOrder';
import { SaleOrderService } from 'src/app/service/sale-order.service';
import { AccessGroup } from 'src/app/model/AccessGroup';
import { LoginService } from 'src/app/service/login.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.css']
})

export class SaleOrderComponent implements OnInit {

  reportHead: string;
  saleOrder: SaleOrder;
  allSaleOrders: SaleOrder;
  sOrder: SaleOrder;
  accessGroup: AccessGroup;
  pageElement: any;
  display: number;
  dateFrom: string;
  dateTo: string;
  searchId: number;
  searchName: string;
  ordersFilter: any;
  filterResult: any;
  showSearchBar1: boolean;
  showSearchBar2: boolean;
  showCost: boolean;
  blankRow: boolean;
  alertType: string;
  alertMessage: string;
  orderComment: string;
  invoiceComment: string;
  currentUser: string = sessionStorage.getItem('name');
  currentUserId: number = Number(sessionStorage.getItem('uid'));
  userId: number;
  createdBy: string;
  updatedBy: string;
  firstRow: number = 0;
  lastRow: number = 5;
  refresh = new EventEmitter();

  orderId: number;
  itemId: number;
  itemName: string;
  orderTotal: number;
  orderCost: number;
  totalAmount: number;
  searchFound: number;
  currentDate = new Date();

  constructor(private login: LoginService, private router: Router, private rout: ActivatedRoute, private orders: SaleOrderService, private location: Location) { }

  ngOnInit(): void {
    this.accessGroup = JSON.parse(sessionStorage.getItem('permissions'));

    if(this.accessGroup.groupName != '') {
      this.orderId = this.rout.snapshot.params.orderId;
      
      if(this.orderId > 0) {
        this.router.navigate(['/sale-order-items', this.orderId]);
      }

      if(this.orderId == 0) {
        this.orders.allOrders().subscribe(
          data => {
            this.saleOrder = data;
            let i: number;
            for(i=0; i<Object.keys(this.saleOrder).length; i++) {
              if(this.saleOrder[i].orderTotal == 0 && this.saleOrder[i].user.userId == this.currentUserId) break;
            }

            this.router.navigate(['/sale-order-items', this.saleOrder[i].orderId]);
        });            
      }
      
      this.orders.allOrders().subscribe(
        data => {
          this.allSaleOrders = data;
          let i: number;
          this.pageElement = document.getElementsByClassName('tblRow');
          for(i=0; i<Object.keys(this.allSaleOrders).length; i++) {
            this.allSaleOrders[i].createdUser = this.allSaleOrders[i].user.firstName + ' ' + this.allSaleOrders[i].user.lastName;
          }
          if(this.accessGroup.orderCurrentUser) sessionStorage.setItem('selecteduser', this.currentUser);
          this.performFilter();
        });
        
      if(localStorage.getItem('show1') == 'Y') this.showCost = true; else this.showCost = false;
    }
  }

  public performFilter() {
      this.goFirst();
      
      // READ FILTER INFO FROM SESSION STORAGE
      let filterCode = Number(sessionStorage.getItem('filter'));
      let customer: string = sessionStorage.getItem('customer');
      let selectedUser = sessionStorage.getItem('selecteduser');
      let oDate = sessionStorage.getItem('date');
      this.dateFrom = sessionStorage.getItem('from');
      this.dateTo = sessionStorage.getItem('to');
      this.searchId = Number(sessionStorage.getItem('oid'));
      this.searchName = customer;
      this.itemId = Number(sessionStorage.getItem('iid'));
      this.itemName = sessionStorage.getItem('iname');

      // CALL LAST ORDERS FILTER
      switch(filterCode) {
        case 1: this.allOrders();
                break;
        case 2: this.todayOrders();
                break;
        case 3: this.dateRangeOrders(this.dateFrom, this.dateTo);
                break;
        case 4: this.notPickedOrders();
                break;
        case 5: this.balanceDueOrders();
                break;
        case 6: this.filterOrdersBySelectedDate(oDate);
                break;
        case 7: this.filterOrdersBySelectedCustomer(customer);
                break;
        case 8: this.filterOrdersBySelectedUser(selectedUser);
                break;
        case 9: this.searchOrderId();
                break;
        case 10: this.searchCustomerName();
                 break;
        case 11: this.ordersForItem();
      }
  }

  public refreshTable() {
    this.showSearchBar1 = false;
    this.showSearchBar2 = false;

    this.orders.allOrders().subscribe(
      data => {
        this.allSaleOrders = data;        
        let i: number;
        for(i=0; i<Object.keys(this.allSaleOrders).length; i++) {
          this.allSaleOrders[i].createdUser = this.allSaleOrders[i].user.firstName + ' ' + this.allSaleOrders[i].user.lastName;
        }
        if(this.accessGroup.orderCurrentUser) {
          sessionStorage.setItem('filter', '8');
          sessionStorage.setItem('selecteduser', this.currentUser);
        }
        this.performFilter();
      });
  }

  public calcTableTotals() {
    this.orderTotal = 0;
    this.totalAmount = 0;
    this.orderCost = 0;
    this.searchFound = Object.keys(this.saleOrder).length
    for(let i=0; i<this.searchFound; i++) {
      this.orderTotal += this.saleOrder[i].orderTotal;
      this.totalAmount += this.saleOrder[i].totalAmount;
      this.orderCost += this.saleOrder[i].orderCost;
    }
  }

  public goFirst() {
    this.firstRow = 0;
    this.lastRow = 5;
  }

  public goLast() {
    this.firstRow = this.searchFound - (this.searchFound % 5);
    this.lastRow = this.searchFound;
  }
  
  public goNext() {
    if(this.lastRow < this.searchFound) {
      this.firstRow = this.lastRow;
      this.lastRow = this.firstRow + 5;
    }
  }
  
  public goPrevious() {
    if(this.firstRow > 0) {
      this.firstRow = this.firstRow - 5;
      this.lastRow = this.firstRow + 5;
    }
  }
  
  public toggleSearchBar1() {    
    this.showSearchBar1 = !this.showSearchBar1;
    this.showSearchBar2 = false;
  }

  public toggleSearchBar2() {    
    this.showSearchBar1 = false;
    this.showSearchBar2 = !this.showSearchBar2;
  }

  public toggleCost() {    
    this.showCost = !this.showCost;
    if(this.showCost) localStorage.setItem('show1', 'Y'); else localStorage.setItem('show1', 'N');
  }

  public hideAlert() {
    this.pageElement = document.getElementById('alert');
    this.pageElement.hidden = true;
  }

  public filterOrdersBySelectedDate(oDate: string) {
    this.display = 6;

    this.reportHead = 'List of Sale Orders for Date - ' + oDate;
    this.dateFrom = oDate;
    this.dateTo = oDate;
    
    this.ordersFilter = this.allSaleOrders;
    this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o.orderDate.toString() == this.dateFrom);
    this.saleOrder = this.filterResult;
    this.calcTableTotals();
    this.searchFound = Object.keys(this.saleOrder).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', this.display.toString());
    sessionStorage.setItem('date', this.dateFrom.toString());
    this.goFirst();
  }

  public filterOrdersBySelectedCustomer(customer: string) {
    this.display = 7;

    this.reportHead = 'List of All Sale Orders for Customer - ' + customer;
    
    this.ordersFilter = this.allSaleOrders;
    this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o.customerName.toLowerCase() == customer.toLowerCase());
    this.saleOrder = this.filterResult;
    this.calcTableTotals();
    this.searchFound = Object.keys(this.saleOrder).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;
  
    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', this.display.toString());
    sessionStorage.setItem('customer', customer);
    this.goFirst();
  }

  public filterOrdersBySelectedUser(user: string) {
    this.display = 8;

    this.reportHead = 'List of All Sale Orders for User - ' + user;

    this.ordersFilter = this.allSaleOrders;
    this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o.createdUser == user);
    this.saleOrder = this.filterResult;
    this.calcTableTotals();
    this.searchFound = Object.keys(this.saleOrder).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;
  
    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', this.display.toString());
    sessionStorage.setItem('selecteduser', user);
    this.goFirst();
  }

  public allOrders() {
    this.display = 1;
    this.blankRow = false;

    if(this.accessGroup.orderCurrentUser) this.reportHead = 'List of All Sale Orders - ' + this.currentUser; else this.reportHead = 'List of All Sale Orders';

    if(this.accessGroup.orderCurrentUser) this.filterOrdersBySelectedUser(this.currentUser); else this.saleOrder = this.allSaleOrders;
    this.calcTableTotals();
    this.searchFound = Object.keys(this.saleOrder).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

    // SAVE FILTER INFO TO SESSION STORAGE
    if(this.accessGroup.orderCurrentUser) sessionStorage.setItem('selecteduser', this.currentUser);
    sessionStorage.setItem('filter', this.display.toString());
    this.goFirst();
  }

  public todayOrders() {
    this.display = 2;
    this.blankRow = false;

    this.currentDate = new Date();
    if(this.accessGroup.orderCurrentUser) this.reportHead = 'List of Today Sale Orders - ' + this.currentUser; else this.reportHead = 'List of Today Sale Orders';

    this.ordersFilter = this.allSaleOrders;
    this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o.orderDate.toString() == this.currentDate.toJSON().substr(0,10));
    this.saleOrder = this.filterResult;
    this.calcTableTotals();
    this.searchFound = Object.keys(this.saleOrder).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', this.display.toString());
    this.goFirst();
  }

  public dateRangeOrders(dateFrom: string, dateTo: string) {
    this.display = 3;

    if(dateFrom == undefined || dateTo == undefined) {
      this.blankRow = true;
      this.orderTotal = 0;
      this.orderCost = 0;
      this.searchFound = 0;  
    } else this.blankRow = false;

    if(this.accessGroup.orderCurrentUser && !this.blankRow) {
      this.reportHead = 'List of Sale Orders (' + dateFrom + ' to ' + dateTo + ') - ' + this.currentUser;
    } else if(!this.blankRow) {
      this.reportHead = 'List of Sale Orders (' + dateFrom + ' to ' + dateTo + ')';
    }

    this.ordersFilter = this.allSaleOrders;
    this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o.orderDate.toString() >= dateFrom && o.orderDate.toString() <= dateTo);
    this.saleOrder = this.filterResult;
    this.calcTableTotals();
    this.searchFound = Object.keys(this.saleOrder).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;
   
    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', this.display.toString());
    sessionStorage.setItem('from', dateFrom.toString());
    sessionStorage.setItem('to', dateTo.toString());
    this.goFirst();
  }

  public notPickedOrders() {
    this.display = 4;
    this.blankRow = false;


    this.goFirst();
  }

  public balanceDueOrders() {
    this.display = 5;
    this.blankRow = false;


    this.goFirst();
  }
  
  public ordersForItem() {
    this.display = 11;
    this.blankRow = false;

    if(this.accessGroup.orderCurrentUser) this.reportHead = 'List of Sale Orders for Item (' + this.itemName + ') - ' + this.currentUser; else this.reportHead = 'List of Sale Orders for Item (' + this.itemName + ')';
    this.orders.getOrdersForStockItem(this.itemId).subscribe(
      data => {
        this.saleOrder = data;
        this.calcTableTotals();
      });
  }

  public searchOrderId() {
    this.display = 9;
    this.blankRow = false;

    if(this.searchId > 0) {
      this.reportHead = 'Sale Order ID (' + this.searchId + ')';
      
      this.ordersFilter = this.allSaleOrders;
      this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o.orderId == this.searchId);
      this.saleOrder = this.filterResult;
      this.calcTableTotals();
      this.searchFound = Object.keys(this.saleOrder).length;
      if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;
    } else {
      this.allOrders();
    }

    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', this.display.toString());
    sessionStorage.setItem('oid', this.searchId.toString());
    this.goFirst();
  }

  public searchCustomerName() {
    this.display = 10;
    this.blankRow = false;

    if(this.searchName != '') {
      this.reportHead = 'List of Sale Orders for Customer Name or Contains (' + this.searchName + ')';

      this.ordersFilter = this.allSaleOrders;
      this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o.customerName.toLowerCase().indexOf(this.searchName.toLowerCase()) != -1);
      this.saleOrder = this.filterResult;
      this.calcTableTotals();
      this.searchFound = Object.keys(this.saleOrder).length;
      if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;
    } else {
       this.allOrders();
    }

    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', this.display.toString());
    sessionStorage.setItem('customer', this.searchName);
    this.goFirst();
  }

  public getOrderInfo(element) {
    this.orderId = this.saleOrder[element].orderId;
    this.orderComment = this.saleOrder[element].orderComment;
    this.invoiceComment = this.saleOrder[element].invoiceComment;
    this.createdBy = this.saleOrder[element].createdBy;
    this.updatedBy = this.saleOrder[element].updatedBy;
  }

  public getOrderById(element) {
    sessionStorage.setItem('details', 'N');
    this.orderId = this.saleOrder[element].orderId;
    this.router.navigate(['/sale-order-items', this.orderId]);
  }
  
  public openNewOrder() {
    this.router.navigate(['/sale-order-items']);
  }

  public cancelOrder(element) {
    this.orderId = this.saleOrder[element].orderId;
    
    let answer: boolean = confirm('Click [OK] to confirm removing Sale Order (' + this.orderId + ') from the list.');
    if(answer) {
      this.orders.cancelOrder(this.orderId).subscribe(
        data => {
          this.refresh.emit();

          // Update Object [allSaleOrders]
          for(let i=0; i<Object.keys(this.allSaleOrders).length; i++) {
            if(this.allSaleOrders[i].orderId == this.orderId) {
              delete this.allSaleOrders[i];

              this.ordersFilter = this.allSaleOrders;
              this.filterResult = this.ordersFilter.filter((o: SaleOrder) => o != null);
              this.saleOrder = this.filterResult;
              this.allSaleOrders = this.saleOrder;
              this.searchFound = Object.keys(this.saleOrder).length;
              if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;
              
              break;
            }
          }          

          this.performFilter();

          this.alertType = 'msg-success';
          this.alertMessage = 'Sale Order (' + this.orderId + ') has been successfully removed from the list.';
          this.pageElement = document.getElementById('alert');
          this.pageElement.hidden = false;
          setTimeout(this.hideAlert, 3500);
        }, error => { 
          if(error.status == 406) {
            this.alertType = 'msg-fail';
            this.alertMessage = 'Sale Order (' + this.orderId + ') cannot be removed due to applied payment or picked up items.';
            this.pageElement = document.getElementById('alert');
            this.pageElement.hidden = false;
            setTimeout(this.hideAlert, 4500);  
          }
      });
    }
  }

}
