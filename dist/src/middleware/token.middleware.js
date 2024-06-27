"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_handler_1 = require("../handlers/response.handler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenDecode = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwtToken;
        if (!token) {
            console.log("Token not found");
            return undefined;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_PASSKEY);
        return decoded;
    }
    catch (err) {
        console.log("Token decode function threw an error", err);
        return undefined;
    }
});
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield tokenDecode(req);
        console.log(decoded);
        if (!decoded) {
            response_handler_1.responseHandler.unauthorizedOperation(res);
            return;
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error(err);
        response_handler_1.responseHandler.error(res, 'error decoding');
    }
});
exports.tokenMiddleware = { auth };
