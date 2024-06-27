"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const responseWithServerParams = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};
const responseWithServerParamsCookies = (res, statusCode, data, cookiesValue) => {
    res
        .cookie("jwtToken", cookiesValue, { httpOnly: true })
        .status(statusCode)
        .json(data);
};
const error = (res, message) => {
    responseWithServerParams(res, 500, {
        status: 500,
        message
    });
};
const notfound = (res) => {
    responseWithServerParams(res, 404, {
        status: 404,
        message: "The resource you're looking for was not found",
    });
};
const badrequest = (res, message) => {
    responseWithServerParams(res, 400, {
        status: 400,
        message,
    });
};
const ok = (res, data) => {
    responseWithServerParams(res, 200, data);
};
const created = (res, data, cookies) => {
    responseWithServerParamsCookies(res, 200, data, cookies);
};
const userLoggedIn = (res, data, cookies) => {
    responseWithServerParamsCookies(res, 200, data, cookies);
};
const incorrectLoginDetails = (res) => {
    responseWithServerParams(res, 401, {
        status: 401,
        message: "Incorrect login details",
    });
};
const unauthorizedOperation = (res) => {
    responseWithServerParams(res, 403, {
        status: 403,
        message: "You are not authorized to perform this operation, Please update your account status",
    });
};
const invalidToken = (res) => {
    responseWithServerParams(res, 403, {
        message: "Invalid token received or passed",
    });
};
exports.responseHandler = {
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
