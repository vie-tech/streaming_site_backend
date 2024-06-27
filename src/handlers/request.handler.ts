import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

 const validate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  } else {
    next();
  }
};

export const requestHandler = {validate}
