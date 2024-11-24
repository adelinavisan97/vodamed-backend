import {
  SignUpCommand,
  SignUpCommandInput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  AuthFlowType,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, getSecretHash, clientId } from './aws-config';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UserRequest } from './models/userRequest.interface';
import { UserRepository } from '../../database/user/user.repository';

export class AuthenticationService {
  constructor(private userRepositroy = new UserRepository()) {}

  // Sign-up method
  public signUp = async (user: UserRequest) => {
    const secretHash = getSecretHash(user.email);
    const params: SignUpCommandInput = {
      ClientId: clientId,
      Username: user.email,
      Password: user.password,
      UserAttributes: [
        {
          Name: 'given_name',
          Value: user.givenName,
        },
        {
          Name: 'family_name',
          Value: user.familyName,
        },
      ],
      SecretHash: secretHash,
    };

    try {
      const command = new SignUpCommand(params);
      const response = await cognitoClient.send(command);
      console.log('SignUp success');
      return response;
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  };

  // Confirm sign-up method
  public confirmSignUp = async (email: string, code: string) => {
    const secretHash = getSecretHash(email);
    const params: ConfirmSignUpCommandInput = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: secretHash,
      ForceAliasCreation: false,
    };

    try {
      const command = new ConfirmSignUpCommand(params);
      const response = await cognitoClient.send(command);
      console.log('ConfirmSignUp success');
      return response;
    } catch (error) {
      console.error('ConfirmSignUp error:', error);
      throw error;
    }
  };

  // Sign-in method
  public signIn = async (email: string, password: string) => {
    const secretHash = getSecretHash(email);
    const params: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const response = await cognitoClient.send(command);
      console.log('SignIn success');

      // Get access token from the response
      const accessToken = response.AuthenticationResult?.AccessToken;
      if (!accessToken) {
        throw new Error('AccessToken not found in the response');
      }

      // Get user details using the access token
      const getUserCommand = new GetUserCommand({ AccessToken: accessToken });
      const userDetails = await cognitoClient.send(getUserCommand);
      const userEmail = userDetails.UserAttributes?.find(
        (attr) => attr.Name === 'email'
      )?.Value;

      if (!userEmail) {
        throw new Error('Email not found in user attributes');
      }

      const userInfo = await this.userRepositroy.getUserInfo(userEmail);
      const { userId, isDoctor } = userInfo;

      // Generate JWT
      const token = jwt.sign(
        {
          email: userEmail,
          sub: response.AuthenticationResult?.AccessToken,
          isDoctor: isDoctor,
        },
        config.JwtSecret,
        { expiresIn: '1h' }
      );

      return { ...response, token, userId, isDoctor };
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  };
}
