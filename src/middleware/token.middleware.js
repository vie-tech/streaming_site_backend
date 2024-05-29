const jwt = require("jsonwebtoken");
const responseHandler = require("../handlers/response.handler");
require("dotenv").config();

const tokenDecode = async (req) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      return console.log("Token not found");
    }
    const decoded = jwt.verify(token, process.env.JWT_PASSKEY);
    return decoded;
  } catch {
    return console.log("Token decode function threw an error");
  }
};

const auth = (req, res, next) => {
  try {
    const decoded = tokenDecode(req);
    if (!decoded) return responseHandler.unauthorizedOperation(res);
    req.user = decoded;
    next();
  } catch {
    return responseHandler.error(res);
  }
};


module.exports = {auth}