import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to check if the user is a doctor
export const checkIfDoctor = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.isDoctor !== true) {
    return res.status(403).json({ message: "Forbidden, not a doctor" });
  }
  next();
};
