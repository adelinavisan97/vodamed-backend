import { ObjectId } from 'mongodb';
import { OrderRepository } from '../../database/order/order.repository';
import { PrescriptionRepository } from '../../database/prescription/prescription.repository';
import { UserRepository } from '../../database/user/user.repository';
import { OrderModel } from './models/order.interace';
import { PerscriptionModel } from './models/perscription.interface';
import { UserModel } from './models/user.interface';
import { sendOrderCreationEmail } from '../aws/emailTemplates/email.templates';
import {
  OrderCreationFields,
  OrderItemEmail,
} from '../aws/emailTemplates/orderFields';
import { MedicineRepository } from '../../database/medicine/medicine.repository';

export class UsersService {
  constructor(
    private userRepository = new UserRepository(),
    private orderRepository = new OrderRepository(),
    private prescriptionRepository = new PrescriptionRepository(),
    private medicineRepository = new MedicineRepository()
  ) {}

  public addUser = async (
    user: Partial<UserModel>,
    cognitoSub: string
  ): Promise<UserModel> => {
    try {
      // Validate
      if (!cognitoSub) throw new Error('CognitoSub missing');

      const createdDate = user.createdDate ?? new Date();
      const userFull: UserModel = {
        ...user,
        familyName: user.familyName as string,
        email: user.email as string,
        givenName: user.givenName as string,
        cognitoId: cognitoSub,
        id: user.id as string,
        createdBy: user.email as string,
        createdDate: createdDate,
        updatedBy: user.email as string,
        updatedDate: user.updatedDate ?? createdDate,
        isAdmin: user.isAdmin ? user.isAdmin : false,
      };

      try {
        await this.userRepository.addUser(userFull);
      } catch (error) {
        throw error;
      }
      return userFull;
    } catch (e) {
      const errorMessage = `Failed to add user. ${e}`;
      console.error({
        message: errorMessage,
        location: 'userService.addUser',
      });
      throw e;
    }
  };

  public getUser = async (
    userEmail: string
  ): Promise<UserModel | undefined> => {
    // Validation
    if (!userEmail) {
      throw new Error('userEmail');
    }

    // Fetch end customer
    let user: UserModel | undefined;
    try {
      user = await this.userRepository.getUser(userEmail);
    } catch (e) {
      const errorMessage = `Failed to fetch user details. ${e}`;
      console.error({
        message: errorMessage,
        location: 'userService.getUser',
      });
      throw e;
    }

    return user;
  };

  //Function to get an array of all patient emails, to be used when a doctor is assigning a
  //perscription
  async getAllPatientInfo(): Promise<object> {
    return await this.userRepository.getAllPatients();
  }

  async createPrescription(prescription: PerscriptionModel): Promise<string> {
    return await this.prescriptionRepository.insertPrescription(prescription);
  }

  async getPrescriptions(userId: string): Promise<PerscriptionModel[]> {
    //Will throw an error if userId is invalid but probably wont happen
    return await this.prescriptionRepository.getUserPrescriptions(
      new ObjectId(userId)
    );
  }

  async createOrder(order: OrderModel): Promise<string> {
    const customer = (await this.userRepository.getUserById(
      order.user
    )) as UserModel;
    const orderItemsWithNames: OrderItemEmail[] = await Promise.all(
      order.orderItems.map(async (item) => {
        const medicineName = await this.medicineRepository.getMedicineName(
          item.medicine.toString()
        );
        return {
          medicine: medicineName,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        };
      })
    );
    const emailBodyData: OrderCreationFields = {
      orderItems: orderItemsWithNames,
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate.toString(),
      customerName: customer.givenName,
    };
    console.log(emailBodyData, order.email);
    await this.orderRepository.insertOrder(order);
    await sendOrderCreationEmail(emailBodyData, [customer.email]);
    return await this.orderRepository.insertOrder(order);
  }

  async getOrders(userId: string): Promise<OrderModel[]> {
    //Will throw an error if userId is invalid but probably wont happen
    return await this.orderRepository.getUserOrders(new ObjectId(userId));
  }
}
