import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import crypto from 'crypto';
import { config } from '../../config';

const REGION = config.Region;
const clientId = config.ClientId;
const clientSecret = config.ClientSecret;
const identityPoolId = config.IdentityPoolId;

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

const credentials = fromCognitoIdentityPool({
  client: new CognitoIdentityClient({ region: REGION }),
  identityPoolId,
});

const getSecretHash = (username: string) => {
  if (!clientSecret) {
    throw new Error(
      'CLIENT_SECRET is not defined in the environment variables.'
    );
  }
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
};

export { cognitoClient, credentials, REGION, getSecretHash, clientId };
