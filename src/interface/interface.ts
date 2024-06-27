import {Request} from 'express'
import { ParsedQs } from 'qs';


export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string | number;
  };
  query: ParsedQs & {
    userId?: string | number;
  };
}

export interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
    age: number;
  }