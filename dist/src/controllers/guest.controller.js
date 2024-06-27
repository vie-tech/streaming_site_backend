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
exports.guestController = void 0;
const response_handler_1 = require("../handlers/response.handler");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_config_1 = __importDefault(require("../database/database.config"));
const query_js_1 = require("../database/query.js");
const table_management_1 = require("../database/table.management");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtPasskey = process.env.JWT_PASSKEY || "default";
const getTemporaryGuestId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Guest function running");
    const uuidValue = (0, uuid_1.v4)();
    const temporaryGuestId = `guest_user_${uuidValue}`;
    if (!temporaryGuestId) {
        throw new Error('Could not generate temporary guestId');
    }
    let client;
    try {
        const create_guest_table = yield (0, table_management_1.createGuestTable)();
        if (!create_guest_table) {
            throw new Error('Could not create table');
        }
        const create_guest_channel_table = yield (0, table_management_1.createGuestChannels)();
        if (!create_guest_channel_table) {
            throw new Error('Could not create table for guest channel');
        }
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        const guest = yield client.query(query_js_1.INSERT_GUEST_QUERY, [temporaryGuestId]);
        const guest_channel = yield client.query(query_js_1.INSERT_GUEST_CHANNEL_QUERY, [guest.rows[0].guest_name]);
        console.log(guest_channel.rowCount);
        if (guest_channel.rowCount == 0) {
            throw new Error('Could not create guest channel please sign in instead');
        }
        response_handler_1.responseHandler.ok(res, {
            guest_channel: guest_channel.rows[0].channel_name,
            guest_id: temporaryGuestId,
        });
        yield client.query('COMMIT');
    }
    catch (err) {
        console.log(err);
        yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
        if (err instanceof Error) {
            console.log(err);
            response_handler_1.responseHandler.error(res, err.message);
        }
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
const getAllGuestLiveStreams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    const guestChannels = yield (0, table_management_1.createGuestChannels)();
    if (!guestChannels) {
        throw new Error('Could not create guest channels table');
    }
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        const channels = yield client.query(query_js_1.GET_ALL_LIVE_GUEST_CHANNEL);
        yield client.query('COMMIT');
        response_handler_1.responseHandler.ok(res, {
            channels: channels.rows,
        });
    }
    catch (err) {
        yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
        if (err instanceof Error) {
            response_handler_1.responseHandler.error(res, err.message);
        }
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
const getJwtTokenForGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    const { userId } = req === null || req === void 0 ? void 0 : req.query;
    if (!userId) {
        throw new Error('User ID not passed found');
    }
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        const payload = {
            user_id: userId,
        };
        const options = {
            expiresIn: "1h",
            issuer: "my_app_url", //REPLACE THIS WITH THE APP URL
        };
        const secretKey = "c6vj2dp2v9a6du7u2cnhembzc3r8k8z958rkabhw2nqvph93jfv2su94sfvtd5t2";
        const token = jsonwebtoken_1.default.sign(payload, secretKey, options);
        if (!token) {
            throw new Error('Could not create JWT token');
        }
        ;
        const user = yield client.query(query_js_1.UPDATE_GUEST_CHANNEL_STATUS, [true, userId]);
        if (!user) {
            throw new Error('Could not update user status');
        }
        yield client.query('COMMIT');
        response_handler_1.responseHandler.ok(res, { token });
    }
    catch (err) {
        yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
        if (err instanceof Error) {
            response_handler_1.responseHandler.error(res, err.message);
        }
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
const endGuestHostCall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    const { guestId } = req === null || req === void 0 ? void 0 : req.query;
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        yield client.query(query_js_1.DELETE_GUEST, [false, guestId]);
        yield client.query('COMMIT');
        response_handler_1.responseHandler.ok(res, { message: 'done' });
    }
    catch (err) {
        yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
        if (err instanceof Error) {
            response_handler_1.responseHandler.error(res, err.message);
        }
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
exports.guestController = {
    getTemporaryGuestId,
    getAllGuestLiveStreams,
    getJwtTokenForGuest,
    endGuestHostCall
};
