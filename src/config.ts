import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: 5555,
  mongoURL: process.env.MONGO_URL!, //Own database URL
  ClientId: process.env.CLIENT_ID!,
  Region: process.env.REGION!,
  ClientSecret: process.env.CLIENT_SECRET!,
  IdentityPoolId: process.env.IDENTITY_POOL_ID!,
  UserCollectionName: "vodamed-users",
  JwtSecret: process.env.JWT_SECRET!,
  OpenAPiKey: process.env.OPEN_API_KEY!,
  DbName: process.env.MONGO_DB_NAME!,
};
