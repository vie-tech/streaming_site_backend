import { Response } from "express";

const responseWithServerParams = (res: Response, statusCode: number, data: object): void => {
  res.status(statusCode).json(data);
};

const responseWithServerParamsCookies = (
  res: Response,
  statusCode: number,
  data: object,
  cookiesValue: string
): void => {
  res
    .cookie("jwtToken", cookiesValue, { httpOnly: true })
    .status(statusCode)
    .json(data);
};

const error = (res: Response, message: string): void => {
  responseWithServerParams(res, 500, {
    status: 500,
    message
  });
};

const notfound = (res: Response): void => {
  responseWithServerParams(res, 404, {
    status: 404,
    message: "The resource you're looking for was not found",
  });
};

const badrequest = (res: Response, message: string): void => {
  responseWithServerParams(res, 400, {
    status: 400,
    message,
  });
};

const ok = (res: Response, data: object): void => {
  responseWithServerParams(res, 200, data);
};

const created = (res: Response, data: object, cookies: string): void => {
  responseWithServerParamsCookies(res, 200, data, cookies);
};

const userLoggedIn = (res: Response, data: object, cookies: string): void => {
  responseWithServerParamsCookies(res, 200, data, cookies);
};

const incorrectLoginDetails = (res: Response): void => {
  responseWithServerParams(res, 401, {
    status: 401,
    message: "Incorrect login details",
  });
};

const unauthorizedOperation = (res: Response): void => {
  responseWithServerParams(res, 403, {
    status: 403,
    message: "You are not authorized to perform this operation, Please update your account status",
  });
};

const invalidToken = (res: Response): void => {
  responseWithServerParams(res, 403, {
    message: "Invalid token received or passed",
  });
};

export const responseHandler = {
  error,
  notfound,
  badrequest,
  ok,
  created,
  userLoggedIn,
  incorrectLoginDetails,
  unauthorizedOperation,
  invalidToken,
};
