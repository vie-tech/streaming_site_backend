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
exports.userController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_config_1 = __importDefault(require("../database/database.config"));
const uuid_1 = require("uuid");
const table_management_1 = require("../database/table.management");
const query_1 = require("../database/query");
const response_handler_js_1 = require("../handlers/response.handler.js");
const dotenv_1 = __importDefault(require("dotenv"));
const hashing_js_1 = require("../helper/hashing.js");
dotenv_1.default.config();
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    const user_table_created = yield (0, table_management_1.createUsersTable)();
    const channel_table_created = yield (0, table_management_1.createChannelsTable)();
    if (!user_table_created || !channel_table_created) {
        return response_handler_js_1.responseHandler.error(res, 'Issue with creating user table');
    }
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        const { username, email, password, age } = req.body;
        // Check if user already exists
        const userAlreadyExists = yield client.query(query_1.SEARCH_QUERY_SIGNUP, [email]);
        if ((userAlreadyExists === null || userAlreadyExists === void 0 ? void 0 : userAlreadyExists.rowCount) !== 0) {
            yield client.query('ROLLBACK');
            return response_handler_js_1.responseHandler.badrequest(res, 'User already exists');
        }
        // Create a new user instance
        const hostId = (0, uuid_1.v4)();
        const channelName = `CHANNEL_${username}_${hostId}`;
        const hashedPassword = yield (0, hashing_js_1.hashPassword)(password);
        const user = yield client.query(query_1.INSERT_QUERY_SIGNUP, [username, email, age, hashedPassword, hostId]);
        const id = user.rows[0].id;
        yield client.query(query_1.INSERT_QUERY_CREATE_CHANNEL, [channelName, id]);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_PASSKEY || '', { expiresIn: '24hr' });
        if (!token) {
            yield client.query('ROLLBACK');
            return response_handler_js_1.responseHandler.invalidToken(res);
        }
        yield client.query('COMMIT');
        response_handler_js_1.responseHandler.created(res, {
            message: "Congratulations, you've been signed up",
            channelName,
        }, token);
    }
    catch (err) {
        yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
        if (err instanceof Error) {
            console.log(err.message);
            response_handler_js_1.responseHandler.error(res, err.message);
        }
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        const { email, password } = req.body;
        // Find user by email
        const user = yield client.query(query_1.SEARCH_LOGIN_QUERY, [email]);
        if (user.rowCount == 0) {
            yield client.query('ROLLBACK');
            return response_handler_js_1.responseHandler.badrequest(res, 'Invalid email or password');
        }
        const account = user.rows[0];
        // Validate user password
        const validPassword = yield (0, hashing_js_1.comparePassword)(password, account.password);
        if (!validPassword) {
            yield client.query('ROLLBACK');
            return response_handler_js_1.responseHandler.badrequest(res, 'Invalid email or password');
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: account.id }, process.env.JWT_PASSKEY || '', { expiresIn: '24hr' });
        if (!token) {
            yield client.query('ROLLBACK');
            return response_handler_js_1.responseHandler.invalidToken(res);
        }
        yield client.query('COMMIT');
        response_handler_js_1.responseHandler.created(res, {
            message: `Welcome back ${account.username}`,
            user: account.username,
            user_host_id: account.hostId,
        }, token);
    }
    catch (err) {
        yield client.query('ROLLBACK');
        console.error(err);
        response_handler_js_1.responseHandler.error(res, 'Token could not be generated');
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
const getJwtTokenForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let client;
    try {
        const userFromMiddleware = req === null || req === void 0 ? void 0 : req.user;
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        if (!userFromMiddleware) {
            return response_handler_js_1.responseHandler.error(res, 'Nothing gotten from middleware');
        }
        const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return response_handler_js_1.responseHandler.error(res, 'User id not found');
        }
        // Create payload and options for JWT token
        const payload = {
            user_id: userId,
        };
        const options = {
            expiresIn: '1h',
            issuer: 'my_app_url', // Replace with your app's URL
        };
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_PASSKEY || '', options);
        if (!token) {
            return response_handler_js_1.responseHandler.error(res, 'Invalid JWT token');
        }
        // Find channel for the user and update isLive status
        const userChannel = yield client.query(query_1.UPDATE_CHANNEL_STATUS, [userFromMiddleware.id]);
        if (userChannel.rowCount === 0) {
            throw new Error('Could not update user channel status');
        }
        // Send success response with token and channel name
        response_handler_js_1.responseHandler.ok(res, { token, channelName: userChannel.rows[0].channel_name });
    }
    catch (err) {
        if (err instanceof Error) {
            yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
            console.error(err);
            response_handler_js_1.responseHandler.error(res, err === null || err === void 0 ? void 0 : err.message);
        }
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
exports.userController = {
    userSignup,
    userLogin,
    getJwtTokenForUser,
};
