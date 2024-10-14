import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { config } from "./config";
import usersRoute from "./routes/userRoutes";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToDatabase } from "./mongodb/mongodb-client";
import { getChatGPTResponse } from "./service/openApiService";
import { verifyToken } from "./middleware/verifyToken";

const app = express();

// Middleware for handling CORS policy
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("This is VodaMed");
});

app.use(express.json());
app.use(bodyParser.json());

app.post("/api/chatgpt", verifyToken, async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await getChatGPTResponse(prompt);
    res.status(200).json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/users", usersRoute);

connectToDatabase()
  .then(() => {
    console.log("App connected to the database");
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
