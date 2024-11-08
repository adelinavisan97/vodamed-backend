import { UserRepository } from './../user/user.repository';
import { config } from "../../config";
import { OrderModel } from "../../modules/users/models/order.interace";
import { getDb } from "../connection"
import { OrderDbModel } from "./orderDb.interface";
import { ObjectId } from 'mongodb';

export class OrderRepository{
    constructor(private userRepository = new UserRepository()){}

    async insertOrder(order: OrderModel): Promise<string>{
            const orderDb: OrderDbModel = {
                user: new ObjectId(order.user),
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
            return "Success"
        } catch (error) {
            console.error({
                message: "Failed to add the order to the collection",
                location: "orderRepository.insertOrder",
            })
            throw new Error()
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

    async getUserOrders(userEmail: string): Promise<OrderModel[] | undefined>{
        const userId = await this.userRepository.getUserId(userEmail) //can probably move this to the service and just pass the id
        try{
            const mongoClient = getDb();
            const userOrders: OrderDbModel[] = await mongoClient
                .collection<OrderDbModel>(config.OrderCollectionName)
                .find({user: userId})
                .toArray()
            if (userOrders){
                return this.toOderModel(userOrders);
            }else{
                console.log("No orders found for "+userEmail)
                return undefined
            }
        }catch (error){
            console.error({
                message: "Error fetching user orders",
                location: "orderRepository.getUserOrders"
            })
            throw new Error()
        }   
    }
}
