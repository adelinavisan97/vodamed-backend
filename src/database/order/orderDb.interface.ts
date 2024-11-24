import { ObjectId } from "mongodb";

export interface OrderDbItem {
    medicine: ObjectId;
    quantity: number;
    price: number;
    total: number;
}

export interface OrderDbModel {
    _id?: ObjectId;
    user: ObjectId;
    orderItems: OrderDbItem[]; // Array of items in the order
    totalAmount: number;
    orderDate: Date;
    shippingAddress: string;
    paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
    createdAt: Date;
    updatedAt: Date;
}