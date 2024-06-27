import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { responseHandler } from "../handlers/response.handler";
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const tokenDecode = async (req: AuthenticatedRequest): Promise<string | jwt.JwtPayload | undefined> => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      console.log("Token not found");
      return undefined;
    }
    const decoded = jwt.verify(token, process.env.JWT_PASSKEY as string);
    return decoded;
  } catch (err) {
    console.log("Token decode function threw an error", err);
    return undefined;
  }
};

 const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const decoded = await tokenDecode(req);
    console.log(decoded);
    if (!decoded) {
      responseHandler.unauthorizedOperation(res);
      return;
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    responseHandler.error(res,'error decoding');
  }
};

export const tokenMiddleware = {auth} 

