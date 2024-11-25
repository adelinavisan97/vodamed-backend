import { ObjectId } from 'mongodb';

export interface OrderEmailItems {
  medicine: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderItem {
  medicine: ObjectId;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderModel {
  user: ObjectId; //Might need to be string instead
  orderItems: OrderItem[]; // Array of items in the order
  totalAmount: number;
  orderDate: Date;
  shippingAddress: string;
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
  createdAt?: Date; //Optional as we don't requrie this from the frontend but we can return it
  updatedAt?: Date;
}
