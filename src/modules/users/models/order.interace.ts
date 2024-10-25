import { ObjectId } from "mongodb";

export interface OrderItem {
    medicine: ObjectId;
    quantity: number;
    price: number;
    total: number;
}

export interface OrderModel {
    user: ObjectId;
    orderItems: OrderItem[]; // Array of items in the order
    totalAmount: number;
    orderDate: Date;
    shippingAddress: string;
    paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
    createdAt: Date;
    updatedAt: Date;
}