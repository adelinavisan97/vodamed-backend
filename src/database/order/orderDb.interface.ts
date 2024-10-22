import { ObjectId } from "mongodb";

export interface OrderItem {
    medicine: ObjectId;
    quantity: number;
    price: number;
    total: number;
}

export interface OrderDbModel {
    _id?: ObjectId;
    user: ObjectId;
    orderItems: OrderItem[]; // Array of items in the order
    totalAmount: number;
    orderDate: Date;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
    createdAt: Date;
    updatedAt: Date;
}