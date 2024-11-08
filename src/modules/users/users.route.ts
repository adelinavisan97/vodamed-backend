import express from "express";
import { UsersService } from "./users.service";
import { AuthenticationService } from "../aws/authentication.service";
import { VerifyMiddleware } from "../../shared/middleware/verfiy.middelware";

const router = express.Router();
const userService = new UsersService();
const authenticaionService =  new AuthenticationService();
const verifyMiddleware = new VerifyMiddleware();

//Might want to rework to have an admin and standard user routes
router.post("/signup", async (req, res) => {
  const user = req.body;
  try {
    // Sign up the user with Cognito
    const cognitoResponse = await authenticaionService.signUp(user);
    console.log("Cognito signup response:", cognitoResponse);

    // Save the user to MongoDB
    const newUser = await userService.addUser(user, cognitoResponse.UserSub!);

    res.status(200).json(newUser);
  } catch (error: any) {
    console.error("SignUp route error:", error);
    res.status(500).json({ error: error.message });
  }
});

//Might be nice to add validation so JSON objects are vaildated when provided against the required schema
//As otherwise types are not enforced at runtime leading to potentially dodgy inserts
//Can use 'joi' library for this apparently 
router.post("/confirm", async (req, res) => {
  const { email, code } = req.body;
  try {
    const response = await authenticaionService.confirmSignUp(email, code);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await authenticaionService.signIn(email, password);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", verifyMiddleware.verifyToken, verifyMiddleware.logout);

router.get("/info", verifyMiddleware.verifyToken, async (req, res) => {
  try {
    const userEmail = (req as any).user.email;
    console.log(userEmail);
    const user = await userService.getUser(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// router.get("/test", async (req, res) =>{
//   console.log(req.body)
//   const test = await prescriptionRepository.getUserPrescriptions(req.body.userEmail)
//   return res.status(200).json(test);
// })

export default router;
