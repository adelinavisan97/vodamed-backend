import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

let tokenBlacklist: Set<string> = new Set();

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class VerifyMiddleware {
  constructor() {}

  // Middleware to verify JWT token
  public verifyToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    if (tokenBlacklist.has(token)) {
      return res
        .status(401)
        .json({ message: 'Unauthorized, token is blacklisted' });
    }

    jwt.verify(token, config.JwtSecret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user = decoded; //Attach decoded values to the request user object
      next();
    });
  };

  // Logout function to blacklist the token
  public logout = (req: AuthenticatedRequest, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      tokenBlacklist.add(token);
    }
    res.status(200).json({ message: 'Logged out successfully' });
  };
}
