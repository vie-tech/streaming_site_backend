export const CREATE_USERS_TABLE: string = `CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    hostId VARCHAR(255) NOT NULL
  );`;

export const CREATE_CHANNELS_FOR_USERS: string = `CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL UNIQUE,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    isLive BOOLEAN DEFAULT FALSE 
  );`;




export const CREATE_TABLE_GUESTS: string = `
  CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
  );`;

export const CREATE_CHANNELS_FOR_GUESTS: string = `
    CREATE TABLE IF NOT EXISTS channels_for_guests (
      id SERIAL PRIMARY KEY,
      channel_name UUID DEFAULT gen_random_uuid(),
      owner_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE
      isLive BOOLEAN DEFAULT FALSE 

    );
  `;


export const SEARCH_QUERY_SIGNUP: string = 'SELECT * FROM accounts WHERE email=$1'
export const INSERT_QUERY_SIGNUP: string = 'INSERT INTO accounts (username, email, age, password, hostId) VALUES ($1, $2, $3, $4, $5) RETURNING id'
export const INSERT_QUERY_CREATE_CHANNEL: string = 'INSERT INTO channels (channel_name, owner_id) VALUES ($1, $2)'
export const SEARCH_LOGIN_QUERY: string = `SELECT * FROM accounts WHERE username=$1`
export const UPDATE_CHANNEL_STATUS: string = `UPDATE channels SET isLive = TRUE WHERE owner_id=$1 RETURNING isLive, channel_name`
export const INSERT_GUEST_QUERY: string = `INSERT INTO guests (guest_name) VALUES ($1) RETURNING guest_name`
export const INSERT_GUEST_CHANNEL_QUERY: string = `INSERT INTO channel_for_guest (owner_id) VALUES($1) RETURNING channel_name`
export const GET_ALL_lIVE_GUEST_CHANNEL: string = `SELECT * FROM channel_for_guest WHERE isLive = true`
export const UPDATE_GUEST_CHANNEL_STATUS: string = `UPDATE channel_for_guest SET isLive =$1 WHERE owner_id =$2`