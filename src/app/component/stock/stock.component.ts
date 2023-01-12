import { Component, Input, Output, OnInit, EventEmitter, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { StockService } from 'src/app/service/stock.service';
import { Stock } from 'src/app/model/Stock';
import { AccessGroup } from 'src/app/model/AccessGroup';
import { element } from 'protractor';
import { stringify } from 'querystring';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnInit {

  reportHead: string;
  accessGroup: AccessGroup;
  allItems: Stock;
  items: Stock;
  itemsUpdate: Stock = new Stock();
  itemsNew: Stock = new Stock();
  itemCount: any;
  searchFound: any;
  pageElement: any;
  itemsFilter: any;
  filterResult: any;
  display: number;
  searchId: number;
  searchName: string;
  showSearchBar1: boolean;
  showSearchBar2: boolean;
  showSize: boolean = true;
  showQTY: boolean = true;
  showCost: boolean;
  showSelling: boolean = true;
  showSale: boolean = true;
  showEditSelling: boolean;
  showEditSale: boolean;
  blankRow: boolean;
  alertType: string;
  alertMessage: string;
  showColumns: any = {
    size: true,
    quantity: true,
    cost: false,
    selling: true,
    sale: true
  };

  refresh = new EventEmitter();

  itemId: number;
  sellingPercent: number;
  salePercent: number;

  constructor(private login: LoginService, private stock: StockService, private router: Router) { }

  ngOnInit(): void {
    this.accessGroup = JSON.parse(sessionStorage.getItem('permissions'));
    
    if(this.accessGroup.groupName != '') {
      this.stock.allStockItems().subscribe(
        data => {
          this.allItems = data;
          this.performFilter();
        });
      
      if(localStorage.getItem('stock_columns') == null) {
          localStorage.setItem('stock_columns', JSON.stringify(this.showColumns));
      } else {
          this.showColumns = JSON.parse(localStorage.getItem('stock_columns'));
      }

      this.showSize = this.showColumns.size;
      this.showQTY = this.showColumns.quantity;
      this.showCost = this.showColumns.cost;
      this.showSelling = this.showColumns.selling;
      this.showSale = this.showColumns.sale;
    }
  }

  public performFilter() {
    // READ FILTER INFO FROM SESSION STORAGE
    this.display = Number(sessionStorage.getItem('sfilter'));
    this.searchId = Number(sessionStorage.getItem('siid'));
    this.searchName = sessionStorage.getItem('siname');
    
    // CALL LAST ITEMS FILTER
    switch(this.display) {
      case 1: this.allStockItems();
              break;
      case 2: this.activeStockItems();
              break;
      case 3: this.inactiveStockItems();
              break;
      case 4: this.searchItemId();
              break;
      case 5: this.searchItemName();
    }
  }

  public refreshTable() {
    this.showSearchBar1 = false;
    this.showSearchBar2 = false;

    this.stock.allStockItems().subscribe(
      data => {
        this.allItems = data; 
        this.performFilter();
      });
  }

  public zeroPercent() {
    this.sellingPercent = 0;
    this.salePercent = 0;
  }

  public toggleSearchBar1() {    
    this.showSearchBar1 = !this.showSearchBar1;
    this.showSearchBar2 = false;
  }

  public toggleSearchBar2() {    
    this.showSearchBar1 = false;
    this.showSearchBar2 = !this.showSearchBar2;
  }

  public toggleSize() {
    this.showSize = !this.showSize;
    this.showColumns.size = this.showSize;
    localStorage.setItem('stock_columns', JSON.stringify(this.showColumns));
  }

  public toggleQTY() {
    this.showQTY = !this.showQTY;
    this.showColumns.quantity = this.showQTY;
    localStorage.setItem('stock_columns', JSON.stringify(this.showColumns));
  }

  public toggleCost() {
    this.showCost = !this.showCost;
    this.showColumns.cost = this.showCost;
    localStorage.setItem('stock_columns', JSON.stringify(this.showColumns));
  }

  public toggleSelling() {
    this.showSelling = !this.showSelling;
    this.showColumns.selling = this.showSelling;
    localStorage.setItem('stock_columns', JSON.stringify(this.showColumns));
  }

  public toggleSale() {
    this.showSale = !this.showSale;
    this.showColumns.sale = this.showSale;
    localStorage.setItem('stock_columns', JSON.stringify(this.showColumns));
  }

  public toggleEditSellingPrice() {
    this.showEditSelling = !this.showEditSelling;
    this.showSelling = !this.showEditSelling;
  }
  
  public toggleEditSalePrice() {
    this.showEditSale = !this.showEditSale;
    this.showSale = !this.showEditSale;
  }
  
  public toggleAllItems() {
    let i: number;
    this.pageElement = document.getElementsByClassName('checkItem');
    for(i=0; i<Object.keys(this.items).length; i++) {
      if(this.items[i].itemStatus) this.pageElement[i].checked = !this.pageElement[i].checked;
    }
  }

  public hideSaved() {
    this.pageElement = document.getElementById('save');
    this.pageElement.hidden = false;
    this.pageElement = document.getElementById('saved');
    this.pageElement.hidden = true;
    this.pageElement = document.getElementById('close1');
    this.pageElement.click();
  }

  public hideAdded() {        
    this.itemsNew = new Stock();
    this.pageElement = document.getElementById('add2');
    this.pageElement.hidden = false;
    this.pageElement = document.getElementById('added');
    this.pageElement.hidden = true;
    this.pageElement = document.getElementById('close2');
    this.pageElement.click();
  }

  public hideApplied1() {
    this.pageElement = document.getElementById('apply1');
    this.pageElement.hidden = false;
    this.pageElement = document.getElementById('applied1');
    this.pageElement.hidden = true;
    this.pageElement = document.getElementById('closeSelling');
    this.pageElement.click();
  }

  public hideApplied2() {
    this.pageElement = document.getElementById('apply2');
    this.pageElement.hidden = false;
    this.pageElement = document.getElementById('applied2');
    this.pageElement.hidden = true;
    this.pageElement = document.getElementById('closeSale');
    this.pageElement.click();
  }

  public hideAlert() {
    this.pageElement = document.getElementById('alert');
    this.pageElement.hidden = true;
  }

  public allStockItems() {
    this.reportHead = 'List of All Stock Items';
    this.display = 1;

    this.items = this.allItems;
    this.searchFound = Object.keys(this.items).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('sfilter', this.display.toString());
  }

  public activeStockItems() {
    this.reportHead = 'List of Active Stock Items';
    this.display = 2;

    this.itemsFilter = this.allItems;
    this.filterResult = this.itemsFilter.filter((i: Stock) => i.itemStatus == true);
    this.items = this.filterResult;
    this.searchFound = Object.keys(this.items).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('sfilter', this.display.toString());
  }

  public inactiveStockItems() {
    this.reportHead = 'List of Inactive Stock Items';
    this.display = 3;

    this.itemsFilter = this.allItems;
    this.filterResult = this.itemsFilter.filter((i: Stock) => i.itemStatus == false);
    this.items = this.filterResult;
    this.searchFound = Object.keys(this.items).length;
    if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('sfilter', this.display.toString());
  }

  public calcSellingPrice1() {
    let priceValue: string;

    if(this.sellingPercent < 0) {
      alert("Please enter a valid profit percentage and try again.");
    } else if(this.sellingPercent > 0) {
          let profit: number = this.sellingPercent / 100;
          let amount: number = this.itemsUpdate.costPrice * profit;
          priceValue = (this.itemsUpdate.costPrice + amount).toFixed(2);
          this.itemsUpdate.sellingPrice = parseFloat(priceValue);
      } else {
        this.itemsUpdate.sellingPrice = this.itemsUpdate.costPrice;
    }

    this.calcSalePrice1();
  }

  public calcSellingPrice2() {
    let priceValue: string;

    if(this.sellingPercent < 0) {
      alert("Please enter a valid profit percentage and try again.");
    } else if(this.sellingPercent > 0) {
          let profit: number = this.sellingPercent / 100;
          let amount: number = this.itemsNew.costPrice * profit;
          priceValue = (this.itemsNew.costPrice + amount).toFixed(2);
          this.itemsNew.sellingPrice = parseFloat(priceValue);
      } else {
        this.itemsNew.sellingPrice = this.itemsNew.costPrice;
    }
    
    this.calcSalePrice2();
  }

  public calcSalePrice1() {
    let priceValue: string;

    if(this.salePercent < 0 || this.salePercent > 100) {
      alert("Please enter a discount percentage from 0 to 100 then click Apply.");
    } else if(this.salePercent > 0) {
          let discount: number = this.salePercent / 100;
          let amount: number = this.itemsUpdate.sellingPrice * discount;
          priceValue = (this.itemsUpdate.sellingPrice - amount).toFixed(2);
          this.itemsUpdate.salePrice = parseFloat(priceValue);
      } else {
        this.itemsUpdate.salePrice = 0;
    }
  }

  public calcSalePrice2() {
    let priceValue: string;

    if(this.salePercent < 0 || this.salePercent > 100) {
      alert("Please enter a discount percentage from 0 to 100 then click Apply.");
    } else if(this.salePercent > 0) {
          let discount: number = this.salePercent / 100;
          let amount: number = this.itemsNew.sellingPrice * discount;
          priceValue = (this.itemsNew.sellingPrice - amount).toFixed(2);
          this.itemsNew.salePrice = parseFloat(priceValue);
      } else {
        this.itemsNew.salePrice = 0;
    }
  }

  public calcPercent1() {
    let percentValue: string;

    if(this.itemsUpdate.costPrice > 0) {
      percentValue = ((this.itemsUpdate.sellingPrice / this.itemsUpdate.costPrice * 100) - 100).toFixed(2);
      this.sellingPercent = parseFloat(percentValue);
    }
    if(this.itemsUpdate.salePrice > 0) {
      percentValue = ((1 - this.itemsUpdate.salePrice / this.itemsUpdate.sellingPrice) * 100).toFixed(2);
      this.salePercent = parseFloat(percentValue);
    } else {
      this.salePercent = 0;
    }
  }

  public calcPercent2() {
    let percentValue: string;

    if(this.itemsNew.costPrice > 0) {
      percentValue = ((this.itemsNew.sellingPrice / this.itemsNew.costPrice * 100) - 100).toFixed(2);
      this.sellingPercent = parseFloat(percentValue);
    }
    if(this.itemsNew.salePrice > 0) {
      percentValue = ((1 - this.itemsNew.salePrice / this.itemsNew.sellingPrice) * 100).toFixed(2);
      this.salePercent = parseFloat(percentValue);
    } else {
      this.salePercent = 0;
    }
  }

  public setSellingPrice() {
    if(this.sellingPercent < 0 || this.sellingPercent == null) {
      alert('Please enter a valid profit percent then click Apply.');
    } else {
      let i: number;
      let count: number = 0;
      this.pageElement = document.getElementsByClassName("checkItem");
      for(i=0; i<this.pageElement.length; i++) {
        if(this.pageElement[i].checked) {
          count++;
          this.stock.updateSellingPrice(this.items[i], this.sellingPercent).subscribe(
            data => {
              this.items[i] = data;

              // Update Object [allItems]
              for(let j=0; j<Object.keys(this.allItems).length; j++) {
                if(this.allItems[j].itemId == this.items[i].itemId) {
                  this.allItems[j] = this.items[i];
                  break;
                }
              }

              this.performFilter();
            });
        }
      }

      if(count == 0) {
        alert('No stock item was selected.\n\nPlease select at least one stock item and try again.');
      } else {
        this.pageElement = document.getElementById('apply1');
        this.pageElement.hidden = true;
        this.pageElement = document.getElementById('applied1');
        this.pageElement.hidden = false;
        setTimeout(this.hideApplied1, 2000);

        this.pageElement = document.getElementById('checkAll');
        this.pageElement.checked = false;
      }
    }
  }

  public setSalePrice() {
    if(this.salePercent < 0 || this.salePercent > 100 || this.salePercent == null) {
      alert('Please enter a discount percent from 0 to 100 then click Apply.');
    } else {
      let i: number;
      let count: number = 0;
      this.pageElement = document.getElementsByClassName("checkItem");
      for(i=0; i<this.pageElement.length; i++) {
        if(this.pageElement[i].checked) {
          count++;
          this.stock.updateSalePrice(this.items[i], this.salePercent).subscribe(
            data => {
              this.items[i] = data;

              // Update Object [allItems]
              for(let j=0; i<Object.keys(this.allItems).length; j++) {
                if(this.allItems[j].itemId == this.items[i].itemId) {          
                  this.allItems[j] = this.items[i];
                  break;
                }
              }
              
              this.performFilter();
            });
        }
      }

      if(count == 0) {
        alert('No stock item was selected.\n\nPlease select at least one stock item and try again.');
      } else {
        this.pageElement = document.getElementById('apply2');
        this.pageElement.hidden = true;
        this.pageElement = document.getElementById('applied2');
        this.pageElement.hidden = false;
        setTimeout(this.hideApplied2, 2000);
       
        this.pageElement = document.getElementById('checkAll');
        this.pageElement.checked = false;
      }
    }
  }

  // SAVE SELLING PRICE COLUMN WHEN EDITABLE
  public saveSellingPrice(element) {
    this.stock.saveSellingPrice(this.items[element], this.items[element].sellingPrice).subscribe(
      data => {
        this.items = data;
      });
  }

  // SAVE SALE PRICE COLUMN WHEN EDITABLE
  public saveSalePrice(element) {
    this.stock.saveSalePrice(this.items[element], this.items[element].salePrice).subscribe(
      data => {
        this.items = data;
      });
    }

  public getItemOrders(itemId: number, itemName: string) {
    // SAVE FILTER INFO TO SESSION STORAGE
    sessionStorage.setItem('filter', '11');
    sessionStorage.setItem('iid', itemId.toString());
    sessionStorage.setItem('iname', itemName);
    
    this.router.navigate(['/sale-order']);
  }

  public searchItemId() {
    this.display = 4;

    if(this.searchId > 0) {
      this.reportHead = 'Stock Item ID (' + this.searchId + ')';
      
      this.itemsFilter = this.allItems;
      this.filterResult = this.itemsFilter.filter((i: Stock) => i.itemId == this.searchId);
      this.items = this.filterResult;
      this.searchFound = Object.keys(this.items).length;
      if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

      // SAVE FILTER INFO TO SESSION STORAGE
      sessionStorage.setItem('sfilter', this.display.toString());
      sessionStorage.setItem('siid', this.searchId.toString());
    } else {
      this.activeStockItems();;
    }
  }

  public searchItemName() {
    this.display = 5;

    if(this.searchName != '') {
      this.reportHead = 'List of Stock Items with Name or Contains (' + this.searchName + ')';

      this.itemsFilter = this.allItems;
      this.filterResult = this.itemsFilter.filter((i: Stock) => i.itemName.toLowerCase().indexOf(this.searchName.toLowerCase()) != -1);
      this.items = this.filterResult;
      this.searchFound = Object.keys(this.items).length;
      if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;

      // SAVE FILTER INFO TO SESSION STORAGE
      sessionStorage.setItem('sfilter', this.display.toString());
      sessionStorage.setItem('siname', this.searchName);
    } else {
      this.activeStockItems();
    }
  }

  public getItemById(element) {
    let percentValue: string;

    this.itemId = this.items[element].itemId;
    this.stock.getItemById(this.itemId).subscribe(
      data => {
        this.itemsUpdate = data;
        if(this.itemsUpdate.costPrice > 0) {
          percentValue = ((this.itemsUpdate.sellingPrice / this.itemsUpdate.costPrice * 100) - 100).toFixed(2);
          this.sellingPercent = parseFloat(percentValue);
        }
        if(this.itemsUpdate.salePrice > 0) {
          percentValue = ((1 - this.itemsUpdate.salePrice / this.itemsUpdate.sellingPrice) * 100).toFixed(2);
          this.salePercent = parseFloat(percentValue);
        }
      });
  }
  
  public getItemCount(itemId: number): number {
    this.stock.getItemCount(itemId).subscribe(
      data => {
        this.itemCount = data; 
        //console.log(this.itemCount);
      });

    return this.itemCount;
  }

  // VALIDATION FOR UPDATE ITEM MODAL
  public validationCheck1(): number {
    let count: number = 0;

    if(this.itemsUpdate.itemName == null) count++;
    if(this.itemsUpdate.itemQTY == null) count++;
    if(this.itemsUpdate.costPrice == null) count++;
    if(this.itemsUpdate.sellingPrice == null) count++;
    if(this.itemsUpdate.itemStatus == null) count++;

    if(count == 0) 
      //if(this.itemsUpdate.itemQTY.valueOf() <= 0 || this.itemsUpdate.costPrice.valueOf() <= 0 || this.itemsUpdate.sellingPrice.valueOf() <= 0 || this.itemsUpdate.salePrice.valueOf() < 0 || this.itemsUpdate.sellingPrice.valueOf() < this.itemsUpdate.costPrice.valueOf() || this.itemsUpdate.salePrice.valueOf() >= this.itemsUpdate.sellingPrice.valueOf()) count = -1;
      if(this.itemsUpdate.itemQTY <= 0 || this.itemsUpdate.itemWeight < 0 || this.itemsUpdate.costPrice <= 0 || this.itemsUpdate.sellingPrice <= 0 || this.itemsUpdate.salePrice < 0 || Number(this.itemsUpdate.sellingPrice) < Number(this.itemsUpdate.costPrice) || Number(this.itemsUpdate.salePrice) >= Number(this.itemsUpdate.sellingPrice)) count = -1;

    return count;
  }

  // VALIDATION FOR NEW ITEM MODAL
  public validationCheck2(): number {
    let count: number = 0;

    if(this.itemsNew.itemName == null) count++;
    if(this.itemsNew.itemQTY == null) count++;
    if(this.itemsNew.costPrice == null) count++;
    if(this.itemsNew.sellingPrice == null) count++;
    if(this.itemsNew.itemStatus == null) count++;

    if(count == 0)
      //if(this.itemsNew.itemQTY.valueOf() <= 0 || this.itemsNew.costPrice.valueOf() <= 0 || this.itemsNew.sellingPrice.valueOf() <= 0 || this.itemsNew.salePrice.valueOf() < 0 || this.itemsNew.sellingPrice.valueOf() < this.itemsNew.costPrice.valueOf() || this.itemsNew.salePrice.valueOf() >= this.itemsNew.sellingPrice.valueOf()) count = -1;
      if(this.itemsNew.itemQTY <= 0 || this.itemsNew.itemWeight < 0 || this.itemsNew.costPrice <= 0 || this.itemsNew.sellingPrice <= 0 || this.itemsNew.salePrice < 0 || Number(this.itemsNew.sellingPrice) < Number(this.itemsNew.costPrice) || Number(this.itemsNew.salePrice) >= Number(this.itemsNew.sellingPrice)) count = -1;

    return count;
  }

  public newItem() {
    if(this.validationCheck2() < 0) {
      alert('Not Allowed Values: \n - Negative numbers. \n - Zero in Quantity, Cost Price and Selling Price. \n - Selling Price less than Cost Price. \n - Sale Price more than or equal to Selling Price. \n\nIn order to save this data, you have to change the values first.');
    } else if(this.validationCheck2() > 0) {
      alert('Required fields must be filled.');
    } else {

      if(this.itemsNew.salePrice == 0 || this.itemsNew.salePrice == null) this.itemsNew.salePrice = 0;
      if(this.itemsNew.itemWeight == null) this.itemsNew.itemWeight = 0;

      this.stock.newStockItem(this.itemsNew).subscribe(
        data => {
          this.refresh.emit();

          this.refreshTable();

          this.pageElement = document.getElementById('add2');
          this.pageElement.hidden = true;
          this.pageElement = document.getElementById('added');
          this.pageElement.hidden = false;
          setTimeout(this.hideAdded, 2000);
        }); 
      }
  }

  public updateItem(itemId: any) {
    if(this.validationCheck1() < 0) {
      alert('Not Allowed Values: \n - Negative numbers. \n - Zero in Quantity, Cost Price and Selling Price. \n - Selling Price less than Cost Price. \n - Sale Price more than or equal to Selling Price. \n\nIn order to save this data, you have to change the values first.');
      this.refreshTable();
    } else if(this.validationCheck1() > 0) {
      alert('Required fields must be filled.');
    } else {

      if(this.itemsUpdate.salePrice == 0 || this.itemsUpdate.salePrice == null) this.itemsUpdate.salePrice = 0;
      if(this.itemsUpdate.itemWeight == null) this.itemsUpdate.itemWeight = 0;

      this.stock.updateStockItem(this.itemsUpdate).subscribe(
        data => {
          this.refresh.emit();

          // Update Object [allItems]
          for(let i=0; i<Object.keys(this.allItems).length; i++) {
            if(this.allItems[i].itemId == itemId) {
              this.allItems[i] = this.itemsUpdate;
              break;
            }
          }

          this.performFilter();

          this.pageElement = document.getElementById('save');
          this.pageElement.hidden = true;
          this.pageElement = document.getElementById('saved');
          this.pageElement.hidden = false;
          setTimeout(this.hideSaved, 2000);
        });
    }
  }

  public deleteItem(element) {
    this.itemId = this.items[element].itemId;
    
    let answer: boolean = confirm('Click [OK] to confirm deletion for Item (' + this.itemId + ') from the stock.');
    if(answer) {
      this.stock.deleteStockItem(this.itemId).subscribe(
        data => {
          this.refresh.emit();          

          // Update Object [allItems]
          for(let i=0; i<Object.keys(this.allItems).length; i++) {
            if(this.allItems[i].itemId == this.itemId) {
              delete this.allItems[i];

              this.itemsFilter = this.allItems;
              this.filterResult = this.itemsFilter.filter((i: Stock) => i != null);
              this.items = this.filterResult;
              this.allItems = this.items;
              this.searchFound = Object.keys(this.items).length;
              if(this.searchFound == 0) this.blankRow = true; else this.blankRow = false;
              
              break;
            }
          }

          this.performFilter();

          this.alertType = 'msg-success';
          this.alertMessage = 'Item (' + this.itemId + ') has been successfully deleted from the stock.';
          this.pageElement = document.getElementById('alert');
          this.pageElement.hidden = false;
          setTimeout(this.hideAlert, 4000);

        }, error => {
          if(error.status == 406) {
            this.alertType = 'msg-fail';
            this.alertMessage = 'Item (' + this.itemId + ') is associated with some sale orders. It cannot be deleted from the stock. Instead, you can set Item Status to [Inactive].';
            this.pageElement = document.getElementById('alert');
            this.pageElement.hidden = false;
            setTimeout(this.hideAlert, 8000);
          }
      });
    }
  }

}
