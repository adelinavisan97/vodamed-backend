export interface OrderItemEmail {
  medicine: string;
  quantity: number;
  price: number;
  total: number;
}
export interface OrderCreationFields {
  orderItems: OrderItemEmail[]; // Array of items in the order
  totalAmount: number;
  orderDate: string;
  shippingAddress: string;
  customerName: string;
}
