"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_GUEST = exports.UPDATE_GUEST_CHANNEL_STATUS = exports.GET_ALL_LIVE_GUEST_CHANNEL = exports.INSERT_GUEST_CHANNEL_QUERY = exports.INSERT_GUEST_QUERY = exports.UPDATE_CHANNEL_STATUS = exports.SEARCH_LOGIN_QUERY = exports.INSERT_QUERY_CREATE_CHANNEL = exports.INSERT_QUERY_SIGNUP = exports.SEARCH_QUERY_SIGNUP = exports.CREATE_CHANNELS_FOR_GUESTS = exports.CREATE_TABLE_GUESTS = exports.CREATE_CHANNELS_FOR_USERS = exports.CREATE_USERS_TABLE = void 0;
exports.CREATE_USERS_TABLE = `CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    hostId VARCHAR(255) NOT NULL
  );`;
exports.CREATE_CHANNELS_FOR_USERS = `CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL UNIQUE,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    isLive BOOLEAN DEFAULT FALSE 
  );`;
exports.CREATE_TABLE_GUESTS = `
  CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
  guest_name VARCHAR(255) UNIQUE NOT NULL
  );`;
exports.CREATE_CHANNELS_FOR_GUESTS = `
  CREATE TABLE IF NOT EXISTS channels_for_guests (
    id SERIAL PRIMARY KEY,
    channel_name UUID DEFAULT gen_random_uuid(),
     owner_id VARCHAR(255) NOT NULL REFERENCES guests(guest_name) ON DELETE CASCADE,
    isLive BOOLEAN DEFAULT FALSE NOT NULL
  );
`;
exports.SEARCH_QUERY_SIGNUP = 'SELECT * FROM accounts WHERE email=$1';
exports.INSERT_QUERY_SIGNUP = 'INSERT INTO accounts (username, email, age, password, hostId) VALUES ($1, $2, $3, $4, $5) RETURNING id';
exports.INSERT_QUERY_CREATE_CHANNEL = 'INSERT INTO channels (channel_name, owner_id) VALUES ($1, $2)';
exports.SEARCH_LOGIN_QUERY = 'SELECT * FROM accounts WHERE username=$1';
exports.UPDATE_CHANNEL_STATUS = 'UPDATE channels SET isLive = TRUE WHERE owner_id=$1 RETURNING isLive, channel_name';
exports.INSERT_GUEST_QUERY = 'INSERT INTO guests (guest_name) VALUES ($1) RETURNING guest_name';
exports.INSERT_GUEST_CHANNEL_QUERY = 'INSERT INTO channels_for_guests (owner_id) VALUES($1) RETURNING channel_name';
exports.GET_ALL_LIVE_GUEST_CHANNEL = 'SELECT * FROM channels_for_guests WHERE isLive = true';
exports.UPDATE_GUEST_CHANNEL_STATUS = 'UPDATE channels_for_guests SET isLive =$1 WHERE owner_id =$2';
exports.DELETE_GUEST = `DELETE FROM channels_for_guests WHERE owner_id = $1`;
