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
exports.createGuestChannels = exports.createGuestTable = exports.createChannelsTable = exports.createUsersTable = void 0;
const query_1 = require("./query");
const database_config_1 = __importDefault(require("./database.config"));
const createUsersTable = () => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        yield client.query(query_1.CREATE_USERS_TABLE);
        yield client.query('COMMIT');
        return true;
    }
    catch (err) {
        yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
        console.log(err);
        return false;
    }
});
exports.createUsersTable = createUsersTable;
const createChannelsTable = () => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        yield client.query(query_1.CREATE_CHANNELS_FOR_USERS);
        yield client.query('COMMIT');
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.createChannelsTable = createChannelsTable;
const ENABLE_PGCRYPTO_EXTENSION = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
`;
const createGuestTable = () => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        yield client.query(ENABLE_PGCRYPTO_EXTENSION);
        yield client.query(query_1.CREATE_TABLE_GUESTS);
        yield client.query('COMMIT');
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.createGuestTable = createGuestTable;
const createGuestChannels = () => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield database_config_1.default.connect();
        yield client.query('BEGIN');
        yield client.query(query_1.CREATE_CHANNELS_FOR_GUESTS);
        yield client.query('COMMIT');
        return true;
    }
    catch (err) {
        yield (client === null || client === void 0 ? void 0 : client.query('ROLLBACK'));
        console.log(err);
        return false;
    }
});
exports.createGuestChannels = createGuestChannels;
