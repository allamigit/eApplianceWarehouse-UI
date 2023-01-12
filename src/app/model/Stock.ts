import { Byte } from "@angular/compiler/src/util";

export class Stock {
    itemId: number;
    itemName: string;
    itemPhoto?: Byte;
    itemSize: number;
    sizeUnit: string;
    itemQTY: number;
    itemWeight?: number;
    costPrice: number;
    sellingPrice: number;
    salePrice: number;
    itemStatus: boolean;
    taxStatus?: boolean;
    itemComment: string;
    createdBy?: string;
    updatedBy?: string;

    constructor() {
        this.itemId = 0;
        this.itemName = '';
        this.itemPhoto = null;
        this.itemSize = null;
        this.sizeUnit = '';
        this.itemQTY = null;
        this.itemWeight = 0;
        this.costPrice = null;
        this.sellingPrice = null;
        this.salePrice = 0;
        this.itemStatus = true;
        this.taxStatus = true;
        this.itemComment = '';
        this.createdBy = '';
        this.updatedBy = '';  
    }
}

