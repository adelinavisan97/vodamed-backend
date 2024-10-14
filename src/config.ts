import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: 5555,
  mongoURL:
    "mongodb+srv://adelina:Mihaileonard1@myatlasclusteredu.ipecla6.mongodb.net/books?retryWrites=true&w=majority&appName=myAtlasClusterEDU",
  ClientId: process.env.CLIENT_ID!,
  Region: process.env.REGION!,
  ClientSecret: process.env.CLIENT_SECRET!,
  IdentityPoolId: process.env.IDENTITY_POOL_ID!,
  UserCollectionName: "book-app-users",
  JwtSecret: process.env.JWT_SECRET!,
  OpenAPiKey: process.env.OPEN_API_KEY!,
};
