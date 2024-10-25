import { UserRepository } from './../user/user.repository';
import { config } from "../../config";
import { OrderModel } from "../../modules/users/models/order.interace";
import { getDb } from "../connection"
import { OrderDbModel } from "./orderDb.interface";

export class OrderRepository{
    constructor(private userRepository = new UserRepository()){}

    async insertOrder(order: OrderModel): Promise<string>{
        try{
            const orderDb: OrderDbModel = {
                user: order.user,
                orderItems: order.orderItems,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate,
                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt, //might want to generate these here instead
            }
            const mongoClient = getDb();
            await mongoClient.collection<OrderDbModel>(config.OrderCollectionName).insertOne(orderDb);
            return 'Success'
        } catch (error) {
            console.error({
                message: "Failed to add the order to the collection",
                location: "orderRepository.insertOrder",
            })
            throw new Error()
        }
    }

    async getUserOrders(userEmail: string){
        const userId = await this.userRepository.getUserId(userEmail)
        try{
            const mongoClient = getDb();
            const userOrders: OrderDbModel[] = await mongoClient
                .collection<OrderDbModel>(config.OrderCollectionName)
                .find({user: userId})
                .toArray()
            return userOrders;
        }catch (error){
            console.error({
                message: "Error fetching user orders",
                location: "orderRepository.getUserOrders"
            })
        }   
    }
}
