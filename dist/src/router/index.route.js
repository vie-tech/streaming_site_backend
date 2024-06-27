"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = __importDefault(require("./user.route"));
const guest_route_1 = __importDefault(require("./guest.route"));
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
routes.use('/user', user_route_1.default);
routes.use('/guest', guest_route_1.default);
exports.default = routes;
