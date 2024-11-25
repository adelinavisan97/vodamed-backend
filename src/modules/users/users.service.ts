import { ObjectId } from 'mongodb';
import { OrderRepository } from '../../database/order/order.repository';
import { PrescriptionRepository } from '../../database/prescription/prescription.repository';
import { UserRepository } from '../../database/user/user.repository';
import {
  PerscriptionModel,
  PrescriptionEmailItems,
} from './models/perscription.interface';
import { UserModel } from './models/user.interface';
import { MailService } from '../../shared/email/email.service';
import { MedicineRepository } from '../../database/medicine/medicine.repository';
import { OrderEmailItems, OrderModel } from './models/order.interace';

export class UsersService {
  constructor(
    private userRepository = new UserRepository(),
    private orderRepository = new OrderRepository(),
    private prescriptionRepository = new PrescriptionRepository(),
    private mailService = new MailService(),
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

  // Get user info by ID
  public getUserById = async (
    userId: string
  ): Promise<UserModel | undefined> => {
    // Validation
    if (!userId) {
      throw new Error('userId');
    }

    // Fetch end customer
    let user: UserModel | undefined;
    try {
      user = await this.userRepository.getUserById(new ObjectId(userId));
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

  //Function to add a presctiption to the database and trigger an email
  async createPrescription(prescription: PerscriptionModel): Promise<string> {
    //Fufuil
    const response = await this.prescriptionRepository.insertPrescription(
      prescription
    );
    if (prescription.emailNotification) {
      const userDetails = await this.userRepository.getUserById(
        prescription.patient
      );

      const prescriptionItemsWithNames: PrescriptionEmailItems[] =
        await Promise.all(
          prescription.medicines.map(async (item) => {
            const medicineName = await this.medicineRepository.getMedicineName(
              item.medicine.toString()
            );
            return {
              medicine: medicineName,
              dosage: item.dosage,
              quantity: item.quantity,
            };
          })
        );
      let prescriptionItemDetails: string = '';
      prescriptionItemsWithNames.forEach((item, index) => {
        prescriptionItemDetails += `Medicine ${index + 1}:\n`;
        prescriptionItemDetails += ` - Name: ${item.medicine}\n`;
        prescriptionItemDetails += ` - Dosage: ${item.dosage}\n`;
        prescriptionItemDetails += ` - Quantity: ${item.quantity}\n`;
        prescriptionItemDetails += `\n`;
      });
      await this.mailService.sendPrescriptionMail(
        userDetails,
        prescriptionItemDetails
      );
    }
    return response;
  }

  async getPrescriptions(userId: string): Promise<PerscriptionModel[]> {
    //Will throw an error if userId is invalid but probably wont happen
    return await this.prescriptionRepository.getUserPrescriptions(
      new ObjectId(userId)
    );
  }

  //Function to add an order to the database and trigger an email
  async createOrder(order: OrderModel): Promise<string> {
    //Prep
    const userDetails = await this.userRepository.getUserById(order.user);

    const orderItemsWithNames: OrderEmailItems[] = await Promise.all(
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
    let orderItemDetails: string = '';
    orderItemsWithNames.forEach((item, index) => {
      orderItemDetails += `Medicine ${index + 1}:\n`;
      orderItemDetails += ` - Name: ${item.medicine}\n`;
      orderItemDetails += ` - Quantity: ${item.quantity}\n`;
      orderItemDetails += ` - Price: £${item.price}\n`;
      orderItemDetails += ` - Toral: £${item.total}\n`;
      orderItemDetails += `\n`;
    });

    //Fufuil
    const response = await this.orderRepository.insertOrder(order);
    await this.mailService.sendOrderMail(userDetails, order, orderItemDetails);
    return response;
  }

  async getOrders(userId: string): Promise<OrderModel[]> {
    //Will throw an error if userId is invalid but probably wont happen
    return await this.orderRepository.getUserOrders(new ObjectId(userId));
  }
}
