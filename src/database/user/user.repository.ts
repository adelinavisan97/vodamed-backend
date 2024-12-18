import { ObjectId } from 'mongodb';
import { UserModel } from '../../modules/users/models/user.interface';
import { UserDbModel } from './userDb.interface';
import { getDb } from '../connection';
import { config } from '../../config';

interface UserInfo {
  userId: string;
  isDoctor: boolean;
}
export class UserRepository {
  constructor() {}

  public addUser = async (user: UserModel): Promise<UserModel> => {
    try {
      this.validateUser(user);
    } catch (error) {
      console.error({
        message:
          'Failed to add user, data validation failed: ' +
          JSON.stringify(error),
        location: 'userRepository.addUser',
      });
      throw new Error(
        'Internal Server Error 500: Failed to validate user data'
      );
    }
    const userDb: UserDbModel = {
      _email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      createdDate: user.createdDate,
      createdBy: user.createdBy,
      cognitoId: user.cognitoId,
      updatedBy: user.updatedBy,
      updatedDate: user.updatedDate,
      isAdmin: user.isAdmin,
    };
    try {
      const mongoClient = getDb();
      await mongoClient
        .collection<Partial<UserDbModel>>(config.UserCollectionName)
        .insertOne(userDb);
      return user;
    } catch (error) {
      console.error({
        message: 'Failed to add user to the database: ' + JSON.stringify(error),
        location: 'userRepository.addUser',
      });
      throw new Error('Internal Server Error 500: Failed to create user');
    }
  };

  private validInsertionDates = (
    createdDate: Date,
    updatedDate: Date
  ): void => {
    if (createdDate !== updatedDate) throw new Error('updatedDate');
  };

  private validateUser = (user: UserModel) => {
    if (!user.email) throw new Error('email');
    if (!user.givenName) throw new Error('givenName');
    if (!user.familyName) throw new Error('familyName');
    if (!user.cognitoId) throw new Error('cognitoId');
    if (!user.createdDate) throw new Error('createdDate');
    if (!user.createdBy) throw new Error('createdBy');
    if (!user.updatedDate) throw new Error('updatedDate');
    if (!user.updatedBy) throw new Error('updatedBy');
    this.validInsertionDates(user.createdDate, user.updatedDate);
  };

  private toUserModel = (user: UserDbModel) => {
    return {
      email: user._email,
      givenName: user.givenName,
      familyName: user.familyName,
      createdDate: user.createdDate,
      createdBy: user.createdBy,
      updatedDate: user.updatedDate,
      updatedBy: user.updatedBy,
      isAdmin: user.isAdmin,
    } as UserModel;
  };

  public getUser = async (
    userEmail: string
  ): Promise<UserModel | undefined> => {
    try {
      if (!userEmail) throw new Error('User email is missing.');
      const mongoClient = getDb();
      const result = (await mongoClient
        .collection(config.UserCollectionName)
        .findOne({ email: userEmail })) as unknown as UserDbModel;
      return result ? this.toUserModel(result) : undefined; //might actually want to return as the dbmodel so they can have the id on the frontend
    } catch (error) {
      console.error({
        message:
          'Failed to fetch user from the database: ' + JSON.stringify(error),
        location: 'userRepository.getUser',
      });
      throw new Error();
    }
  };

  async getUserById(userId: ObjectId): Promise<UserModel> {
    try {
      const mongoClient = getDb();
      const result = await mongoClient
        .collection<UserDbModel>(config.UserCollectionName)
        .findOne({ _id: new ObjectId(userId) });
      if (!result) {
        throw new Error(`No user found with id: ${userId}`);
      }
      return this.toUserModel(result);
    } catch (error) {
      console.error(error);
      console.error({
        message:
          'Failed to fetch user from the database: ' + JSON.stringify(error),
        location: 'userRepository.getUserById',
      });
      throw new Error(
        'Internal Server Error: Unable to fetch user details for email sending'
      );
    }
  }

  async getUserInfo(userEmail: string): Promise<UserInfo> {
    try {
      const mongoClient = getDb();
      const result = await mongoClient
        .collection<UserDbModel>(config.UserCollectionName)
        .findOne({ _email: userEmail });

      if (!result) {
        throw new Error(`No user found with email: ${userEmail}`);
      }

      return {
        userId: result._id.toString(),
        isDoctor: result.isAdmin,
      };
    } catch (error) {
      console.error({
        message: 'Error fetching user ID: ' + (error as Error).message,
        location: 'userRepository.getUserId',
      });
      throw new Error('Internal Server Error: Unable to fetch user ID');
    }
  }
  //Probably going to need a function to get all users for doctors assigning prescriptions
  async getAllPatients(): Promise<object[]> {
    try {
      const mongoClient = getDb();
      const result = await mongoClient
        .collection(config.UserCollectionName)
        .find({ isAdmin: false })
        .toArray();

      // Ensure result is an array
      if (!Array.isArray(result)) {
        throw new Error('Result is not an array');
      }

      const formattedDetails = result.reduce<{ id: any; email: any }[]>(
        (acc, current) => {
          // Push the object with `id` and `email` properties into the accumulator
          acc.push({ id: current._id.toString(), email: current._email });
          return acc;
        },
        []
      ); // Initializing as an empty array
      return formattedDetails;
    } catch (error) {
      console.error({
        message: 'Error fetching patients: ' + (error as Error).message,
        location: 'userRepository.getAllPatients',
      });
      throw new Error('Internal Server Error: Unable to fetch patients');
    }
  }
}
