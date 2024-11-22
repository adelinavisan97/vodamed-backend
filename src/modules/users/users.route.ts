import express from 'express';
import { UsersService } from './users.service';
import { AuthenticationService } from '../aws/authentication.service';
import { VerifyMiddleware } from '../../shared/middleware/verfiy.middelware';
import { checkIfDoctor } from '../../shared/middleware/checkDoctor.middleware';

const router = express.Router();
const userService = new UsersService();
const authenticaionService = new AuthenticationService();
const verifyMiddleware = new VerifyMiddleware();

//Might want to rework to have an admin and standard user routes
router.post('/signup', async (req, res) => {
  const user = req.body;
  try {
    // Sign up the user with Cognito
    const cognitoResponse = await authenticaionService.signUp(user);
    console.log('Cognito signup response:', cognitoResponse);

    // Save the user to MongoDB
    const newUser = await userService.addUser(user, cognitoResponse.UserSub!);

    res.status(200).json(newUser);
  } catch (error: any) {
    console.error('SignUp route error:', error);
    res.status(500).json({ error: error.message });
  }
});

//Might be nice to add validation so JSON objects are vaildated when provided against the required schema
//As otherwise types are not enforced at runtime leading to potentially dodgy inserts
//Can use 'joi' library for this apparently
router.post('/confirm', async (req, res) => {
  const { email, code } = req.body;
  try {
    const response = await authenticaionService.confirmSignUp(email, code);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await authenticaionService.signIn(email, password);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', verifyMiddleware.verifyToken, verifyMiddleware.logout);

router.get('/info', verifyMiddleware.verifyToken, async (req, res) => {
  try {
    const userEmail = (req as any).user.email;
    const user = await userService.getUser(userEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//This endpoint will return the emails and ids of all users who are not admins (patients)
router.get(
  '/getAllPatientInfo',
  verifyMiddleware.verifyToken,
  //checkIfDoctor,
  async (req, res) => {
    try {
      const response = await userService.getAllPatientInfo();
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Can create a prescription providing doctor and patient as same id
//but cba to add validation for it and it shouldn't be a problem in practice
//This endpoint will create a prescription in the database using the provided body
router.post(
  '/createPrescription',
  verifyMiddleware.verifyToken,
  //checkIfDoctor,
  async (req, res) => {
    try {
      const response = await userService.createPrescription(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

//I like to pass as part of the path but if others do not like it happy to change it
//This endpoint will get all prescriptions for a specific user and return them as an array
router.get(
  '/:userId/getPrescriptions',
  verifyMiddleware.verifyToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const response = await userService.getPrescriptions(userId);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Should probably check the provided medicine actually exists
//This endpoint will create an order in the database using the provided body
router.post('/createOrder', verifyMiddleware.verifyToken, async (req, res) => {
  try {
    const response = await userService.createOrder(req.body);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//This endpoint will return all of a provided users orders as an array
router.get(
  '/:userId/getOrders',
  verifyMiddleware.verifyToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const response = await userService.getOrders(userId);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
