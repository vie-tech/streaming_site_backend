"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = Number(process.env.POSTGRES_PORT);
const password = process.env.POSTGRES_PASSWORD || "DEFALULT";
const pool = new pg_1.Pool({
    user: "postgres",
    host: 'localhost',
    database: "anon_stream_db",
    password: "genders1703",
    port: port || undefined,
});
exports.default = pool;
