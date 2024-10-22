import { UserRepository } from "../../database/user/user.repository";
import { UserModel } from "./models/user.interface";


export class UsersService {
  constructor(private userRepository = new UserRepository()) {}

  public addUser = async (
    user: Partial<UserModel>,
    cognitoSub: string
  ): Promise<UserModel> => {
    try {
      // Validate
      if (!cognitoSub) throw new Error("CognitoSub missing");

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
        location: "userService.addUser",
      });
      throw e;
    }
  };

  public getUser = async (
    userEmail: string
  ): Promise<UserModel | undefined> => {
    // Validation
    if (!userEmail) {
      throw new Error("userEmail");
    }

    // Fetch end customer
    let user: UserModel | undefined;
    try {
      user = await this.userRepository.getUser(userEmail);
    } catch (e) {
      const errorMessage = `Failed to fetch user details. ${e}`;
      console.error({
        message: errorMessage,
        location: "userService.getUser",
      });
      throw e;
    }

    return user;
  };
}
