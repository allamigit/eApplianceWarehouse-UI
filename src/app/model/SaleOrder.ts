import { stringify } from "querystring";
import { User } from "./User";

export class SaleOrder {
    orderId: number;
    orderDate: Date;
    orderPO?: string;
    customerName: string;
    orderComment: string;
    invoiceComment?: string;
    grossTotal?: number;
    orderCost: number;
    discountPercent?: number;
    discountAmount?: number;
    discountTotal?: number;
    orderTotal: number;
    saleTax?: number;
    stateTax?: number;
    totalAmount?: number;
    amountPaid?: number;
    amountDue?: number;
    itemsWeight?: number;
    itemsCount?: number;
    pickupCount?: number;
    billingStatus?: boolean;
    billingDate?: Date;
    user: User;
    userId: number;
    createdUser?: string;
    createdBy?: string;
    updatedBy?: string;

    constructor() {
        this.orderId = 0;
        this.orderDate = null;
        this.orderPO = null;
        this.customerName = null;
        this.orderComment = null;
        this.invoiceComment = null;
        this.grossTotal = 0;
        this.orderCost = 0;
        this.discountPercent = 0;
        this.discountAmount = 0;
        this.discountTotal = 0;
        this.orderTotal = 0;
        this.saleTax = 0;
        this.stateTax = 0;
        this.totalAmount = 0;
        this.amountPaid = 0;
        this.amountDue = 0;
        this.itemsWeight = 0;
        this.itemsCount = 0;
        this.pickupCount = 0;
        this.billingStatus = false;
        this.billingDate = null;
        this.user = new User();
        this.userId = 0;
        this.createdUser = null;
        this.createdBy = null;
        this.updatedBy = null;
    }
}