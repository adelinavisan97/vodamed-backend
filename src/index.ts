import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { config } from './config';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectToDatabase } from './database/connection';
import usersRoute from './modules/users/users.route';
import gptRoute from './modules/gpt/gpt.route';
import medicineRoute from './modules/medicine/medicine.route';

const app = express();

//Middleware for handling CORS policy
//NOT SURE THIS IS WORKING ANYMORE
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://adelinavisan97.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.use('/api/gpt', gptRoute);
app.use('/api/users', usersRoute);
app.use('/api/medicine', medicineRoute);

connectToDatabase()
  .then(() => {
    console.log('App connected to the database');
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });
