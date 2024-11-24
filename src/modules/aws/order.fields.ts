import { ObjectId } from "mongodb";
export interface OrderDbItem { 
    medicine: ObjectId;
    quantity: number;
    price: number;
    total: number;
}
export interface OrderCreationFields { 
    orderItems: OrderDbItem[]; // Array of items in the order
    totalAmount: number;
    orderDate: Date;
    shippingAddress: string;
}
   
