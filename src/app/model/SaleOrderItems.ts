export class SaleOrderItems {
    itemSEQ: number;
    orderId: number;
    itemId: number;
    soldQTY: number;
    costPrice: number;
    unitPrice: number;
    salePrice: number;
    subtotal: number;
    taxStatus?: boolean;
    itemWeight?: number;
    pickupCount?: number;
    itemsLeft?: number;

    constructor() {
        this.itemSEQ = 0;
        this.orderId = 0;
        this.itemId = 0;
        this.soldQTY = 0;
        this.costPrice = 0;
        this.unitPrice = 0;
        this.salePrice = 0;
        this.subtotal = 0;
        this.taxStatus = false;
        this.itemWeight = 0;
        this.pickupCount = 0;
        this.itemsLeft = 0;
    }
}