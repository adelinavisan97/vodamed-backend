import { UserRepository } from './../user/user.repository';
import { config } from "../../config";
import { OrderModel } from "../../modules/users/models/order.interace";
import { getDb } from "../connection"
import { OrderDbModel } from "./orderDb.interface";
import { ObjectId } from 'mongodb';

export class OrderRepository{
    constructor(){}

    async insertOrder(order: OrderModel): Promise<string>{
            const orderDb: OrderDbModel = {
                user: new ObjectId(order.user), //This assumes we are being passed the user's id
                orderItems: order.orderItems,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate,
                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        try{
            const mongoClient = getDb();
            await mongoClient.collection<OrderDbModel>(config.OrderCollectionName).insertOne(orderDb);
            return "Successfully inserted the user's order"
        } catch (error) {
            console.error({
                message: "Failed to add the order to the collection" + JSON.stringify(error),
                location: "orderRepository.insertOrder",
            })
            throw new Error("Internal Server Error 500: Failed to create order")
        }
    }

    private toOderModel(orders: OrderDbModel[]): OrderModel[]{
        const newOrders: OrderModel[] = orders.map(order => ({
            user: order.user,
            orderItems: order.orderItems,
            totalAmount: order.totalAmount,
            orderDate: order.orderDate,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }));
        return newOrders;
    }

    async getUserOrders(userId: ObjectId): Promise<OrderModel[]>{
        try{
            const mongoClient = getDb();
            const userOrders: OrderDbModel[] = await mongoClient
                .collection<OrderDbModel>(config.OrderCollectionName)
                .find({user: userId})
                .toArray()
            
            return this.toOderModel(userOrders) || []

        }catch (error){
            console.error({
                message: "Error fetching user orders" + JSON.stringify(error),
                location: "orderRepository.getUserOrders"
            })
            throw new Error("Internal Server Error 500: Error fetching orders")
        }   
    }
}
