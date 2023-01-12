import { Component, Input, Output, OnInit, EventEmitter, NgModule, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Stock } from 'src/app/model/Stock';
import { SaleOrder } from 'src/app/model/SaleOrder';
import { SaleOrderItems } from 'src/app/model/SaleOrderItems';
import { StockService } from 'src/app/service/stock.service';
import { SaleOrderService } from 'src/app/service/sale-order.service';
import { SaleOrderItemsService } from 'src/app/service/sale-order-items.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AccessGroup } from 'src/app/model/AccessGroup';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-sale-order-items',
  templateUrl: './sale-order-items.component.html',
  styleUrls: ['./sale-order-items.component.css']
})
export class SaleOrderItemsComponent implements OnInit {

  saleOrder: SaleOrder;
  saleOrderItems: SaleOrderItems;
  stockList: Stock;
  accessGroup: AccessGroup;
  pageElement: any;
  currentDate = new Date();
  currentUser: string = sessionStorage.getItem('name');
  currentUserId: number = Number(sessionStorage.getItem('uid'));
  itemId: number;
  soldQTY: number;
  costPrice: number;
  unitPrice: number;
  salePrice: number;
  searchName: string;
  showSearchBar1: boolean;
  showSearchBar2: boolean;
  showCost: boolean;
  showCreateOrder: boolean;
  disableSalePrice: boolean = true;
  orderReadOnly: boolean;
  spinner1: boolean;
  spinner2: boolean;
  itemSelected: boolean;

  refresh = new EventEmitter();

  //@Output() idEvent = new EventEmitter<number>();
  
  constructor(private login: LoginService, private orders: SaleOrderService, private items: SaleOrderItemsService, private stock: StockService, 
    private router: ActivatedRoute, private router1: Router, private location: Location) { }

  ngOnInit(): void {
    //this.idEvent.emit(this.orderId);
    
    this.accessGroup = JSON.parse(sessionStorage.getItem('permissions'));

    if(this.accessGroup.groupName != '') {
      if(this.router.snapshot.params.orderId != null) {
        this.getOrderById(this.router.snapshot.params.orderId);
      } else { 
        this.pageElement = document.getElementById('oDate');
        this.pageElement.value = this.currentDate.toJSON().substr(0,10);
        this.saleOrder = new SaleOrder();
        this.saleOrder.orderDate = this.pageElement.value;

        sessionStorage.setItem('order_details', 'N');
        this.showCreateOrder = true;
        if(localStorage.getItem('show2') == 'Y') this.showCost = true; else this.showCost = false;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    alert('DONE');
  }

  public goBack() {   // NOT USED
    this.location.back();
    //this.router1.navigate(['/sale-order']);
  }

  public toggleCost() {    
    this.showCost = !this.showCost;
    if(this.showCost) localStorage.setItem('show2', 'Y'); else localStorage.setItem('show2', 'N');
  }

  public toggleAllItems() {    
    let i: number;
    let checkBox: boolean;
    this.pageElement = document.getElementById('checkAll');
    if(this.pageElement.checked) checkBox = true; else checkBox = false;

    this.pageElement = document.getElementsByClassName('checkItem');
    for(i=0; i<Object.keys(this.items).length; i++) {
      if(checkBox) this.pageElement[i].checked = true; else this.pageElement[i].checked = false;
    }
  }

  public hideSaved() {
    this.pageElement = document.getElementById('save');
    this.pageElement.hidden = false;
    this.pageElement = document.getElementById('saved');
    this.pageElement.hidden = true;
  }

  public changeBillingStatus() {
    if(this.saleOrder.billingStatus == false && this.saleOrder.billingDate == null) {
      alert('Invoice Date is required');
    } else {
      this.saleOrder.billingStatus = !this.saleOrder.billingStatus;
      if(this.saleOrder.billingStatus == false) this.saleOrder.billingDate = null;
      this.saveChanges();
      this.pageElement = document.getElementById('closeInvoice');
      this.pageElement.click();
    }
  }

  public retrievePrices() {
    this.spinner1 = true;

    this.pageElement = document.getElementsByClassName('checkItem');
    let i: number;
    let count: number = 0;
    for(i=0; i<Object.keys(this.pageElement).length; i++) {
      if(this.pageElement[i].checked) {
        count++;
        this.stock.getItemById(this.saleOrderItems[i].stock.itemId).subscribe(
          data => {
            this.saleOrderItems[i].stock = data;
          });

          this.saleOrderItems[i].unitPrice = this.saleOrderItems[i].stock.sellingPrice;
          this.saleOrderItems[i].salePrice = this.saleOrderItems[i].stock.salePrice;

          this.orders.updateOrder(this.saleOrder).subscribe(
          data => {
            this.refresh.emit();
          });

        this.items.updateOrderItem(this.saleOrderItems[i]).subscribe(
          data => {
            this.refresh.emit();
            this.getOrderById(this.saleOrder.orderId);
            this.spinner1 = false;
            this.pageElement = document.getElementById('checkAll');
            this.pageElement.checked = false;
          });
      }
    }

    if(count == 0) {
      this.spinner1 = false;
      alert('No item was selected.\n\nPlease select at least one item and try again.');
    }
  }
   
  public retrieveUnitPrice(orderId: number) {   // NOT USED
    this.spinner1 = true;

    this.items.retrieveUnitPrice(orderId).subscribe(
      data => {
        this.saleOrderItems = data;
        this.getOrderById(this.saleOrder.orderId);
        this.spinner1 = false;
      });
  }
  
  public retrieveSalePrice(orderId: number) {   // NOT USED
    this.spinner2 = true;
    
    this.items.retrieveSalePrice(orderId).subscribe(
      data => {
        this.saleOrderItems = data;
        this.getOrderById(this.saleOrder.orderId);
        this.spinner2 = false;
      });
  }

  // GET ORDER INFORMATION
  public getOrderById(orderId: number) {
    // Select Order Details Tab when Add New Item
    /*if(sessionStorage.getItem('order_details') == 'Y') {
      sessionStorage.setItem('order_details', 'N');
      this.pageElement = document.getElementById('details-tab');
      this.pageElement.click();
    }*/
    
    // Get Order Summary
    this.orders.getOrderById(orderId).subscribe(
      data => {
        this.saleOrder = data;
        
        if(this.accessGroup.orderOtherUserReadOnly && this.saleOrder.user.userId != this.currentUserId) this.orderReadOnly = true; else this.orderReadOnly = false;
      });
      
      // Get Order Details
      this.items.allOrderItems(orderId).subscribe(
        data => {
          this.saleOrderItems = data;

          // Select Order Details Tab when Add New Item
          if(sessionStorage.getItem('order_details') == 'Y') {
            sessionStorage.setItem('order_details', 'N');
            this.pageElement = document.getElementById('details-tab');
            this.pageElement.click();
          }
        });
      
    if(localStorage.getItem('show2') == 'Y') this.showCost = true; else this.showCost = false;
  }

  // ADD ACTIVE STOCK ITEMS TO DROPDOWN LIST WHEN TYPING IN SEARCH ITEM NAME
  public getActiveItems() {
    this.stock.getActiveItemByName(this.searchName.toLowerCase()).subscribe(data => this.stockList = data); 
    
    this.soldQTY = 0;
    this.costPrice = 0;
    this.unitPrice = 0;
    this.salePrice = 0;
  }

  // CHOOSE ITEM NAME FROM DROPDOWN LIST
  public chooseItem() {
    this.pageElement = document.getElementById('itemSelection');
    this.itemId = this.pageElement.value;

    let i: number;
    for(i=0; i<Object.keys(this.stockList).length; i++) {
      if(this.stockList[i].itemId == this.itemId) break;
    }

    this.soldQTY = this.stockList[i].itemQTY;
    this.costPrice = this.stockList[i].costPrice;
    this.unitPrice = this.stockList[i].sellingPrice;
    this.salePrice = this.stockList[i].salePrice;

    if(this.salePrice > 0) {
      this.disableSalePrice = false;
    } else {
      this.disableSalePrice = true;
    }
  }

  // ADD NEW ORDER ITEM
  public newItem() {
    this.showCreateOrder = false;

    if(this.salePrice == 0 || this.salePrice == null) this.salePrice = 0;

    if(this.soldQTY > 0 && this.unitPrice > 0) {
      this.stock.getItemById(this.itemId).subscribe(
        data => { 
          this.stockList = data;
        }, error => {
          if(error.status == 400) {
            alert('Required fields must be filled.');
          }
      });

      let i: number;
      for(i=0; i<Object.keys(this.stockList).length; i++) {
        if(this.stockList[i].itemId == this.itemId) break;
      }

      let addItem: any = {
        itemSEQ: 0,
        saleOrder: {
            orderId: this.saleOrder.orderId,
            orderDate: this.saleOrder.orderDate,
            orderPO: this.saleOrder.orderPO,
            customerName: this.saleOrder.customerName,
            orderComment: this.saleOrder.orderComment,
            orderTotal: 0,
            orderCost: 0,
            createdBy: this.saleOrder.createdBy,
        },
        stock: {
            itemId: this.stockList[i].itemId,
            itemName: this.stockList[i].itemName,
            itemSize: this.stockList[i].itemSize,
            sizeUnit: this.stockList[i].sizeUnit,
            itemQTY: this.stockList[i].itemQTY,
            costPrice: this.stockList[i].costPrice,
            sellingPrice: this.stockList[i].sellingPrice,
            salePrice: this.stockList[i].salePrice,
            itemStatus: this.stockList[i].itemStatus,
            itemComment: this.stockList[i].itemComment
        },
        soldQTY: this.soldQTY,
        costPrice: this.costPrice,
        unitPrice: this.unitPrice,
        salePrice: this.salePrice,
        subtotal: 0
      };
      sessionStorage.setItem('order_details', 'Y');
      
      this.items.newOrderItem(addItem).subscribe(
        data => {
          this.refresh.emit();          
          //this.getOrderById(this.saleOrder.orderId);
          this.router1.navigate(['/sale-order', this.saleOrder.orderId]);
        }, error => {
          if(error.status == 406) {
            alert('Invalid Quantity, Unit Price or Sale Price. \n\nMake sure that there is enough Quantity in stock or not zero and Unit Price or Sale Price is not less than item cost.');
            this.getActiveItems();
            this.pageElement = document.getElementById('itemSelection');
            this.pageElement.value =  this.itemId;

            this.soldQTY = addItem.stock.itemQTY;
            this.costPrice = addItem.stock.costPrice;
            this.unitPrice = addItem.stock.sellingPrice;
            this.salePrice = addItem.stock.salePrice;
          }
      });
      
    } else {
      alert('Required fields must be filled.');
    }
  }

  // SAVE WHEN INPUT - UPDATE ITEM QTY, UNIT PRICE & SALE PRICE
  public saveItem(element) {
    if(this.saleOrderItems[element].salePrice == 0 || this.saleOrderItems[element].salePrice == null) this.saleOrderItems[element].salePrice = 0;

    this.orders.updateOrder(this.saleOrder).subscribe(
      data => {
        this.refresh.emit();
    });

    this.items.updateOrderItem(this.saleOrderItems[element]).subscribe(
      data => {
        this.refresh.emit();
        this.getOrderById(this.saleOrder.orderId);
      }, error => {
        if(error.status == 406) {
          this.items.allOrderItems(this.saleOrder.orderId).subscribe(data => this.saleOrderItems = data);
          alert('Invalid Quantity, Unit Price or Sale Price. \n\nMake sure that there is enough Quantity in stock or not zero and Unit Price or Sale Price is not less than item cost.');
        }
    });
  }

  // DELETE ICON - REMOVE ITEM FROM ORDER
  public removeItem(element) {
    let answer: boolean = confirm('Click [OK] to confirm removing item [' + this.saleOrderItems[element].stock.itemName + '] from Sale Order.');
    if(answer) {
      if(Object.keys(this.saleOrderItems).length == 1) { 
        this.saleOrder.orderCost = 0;
        this.saleOrder.grossTotal = 0;
        this.saleOrder.discountPercent = 0;
        this.saleOrder.discountAmount = 0;
        this.saleOrder.discountTotal = 0;
        this.saleOrder.saleTax = 0;
        this.saleOrder.stateTax = 0;
        this.saleOrder.orderTotal = 0;
        this.saleOrder.totalAmount = 0;
        this.saleOrder.amountDue = this.saleOrder.totalAmount - this.saleOrder.amountPaid;
      }
  
      this.items.removeOrderItem(this.saleOrderItems[element].itemSEQ).subscribe(
        data => {
          this.refresh.emit();
          this.getOrderById(this.saleOrder.orderId);
      });

      this.orders.updateOrder(this.saleOrder).subscribe(
        data => {
          this.refresh.emit();
      });
    }
  }

  // CREATE NEW SALE ORDER
  public newOrder() {
    if(this.saleOrder.orderDate != null && this.saleOrder.customerName != null) {
      this.orders.newOrder(this.saleOrder).subscribe(
        data => {
          this.refresh.emit();       
      
        this.showCreateOrder = false;
        sessionStorage.setItem('order_details', 'Y');
        this.router1.navigate(['/sale-order', this.saleOrder.orderId]);
      });

    } else {
      alert('Required fields must be filled.');
    }
  }

  public clearDiscountPercent() {
    this.saleOrder.discountPercent = 0;
  }

  public clearDiscountAmount() {
    this.saleOrder.discountAmount = 0;
  }

  // SAVE CHANGES FOR SALE ORDER SUMMARY
  public saveChanges() {
    this.orders.updateOrder(this.saleOrder).subscribe(
      data => {
        this.refresh.emit();

        this.pageElement = document.getElementById('save');
        this.pageElement.hidden = true;
        this.pageElement = document.getElementById('saved');
        this.pageElement.hidden = false;
        setTimeout(this.hideSaved, 3000);
      });
  }

}
