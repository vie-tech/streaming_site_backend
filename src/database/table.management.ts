import { CREATE_USERS_TABLE, CREATE_CHANNELS_FOR_USERS, CREATE_TABLE_GUESTS, CREATE_CHANNELS_FOR_GUESTS } from "./query"
import pool from "./database.config"
import { PoolClient } from "pg"


export const createUsersTable = async () => {
    let client: PoolClient | undefined;

    try {
        client = await pool.connect()
        await client.query('BEGIN')
        await client.query(CREATE_USERS_TABLE)
        await client.query('COMMIT')
        return true
    } catch (err) {
        await client?.query('ROLLBACK')
        console.log(err)
        return false
    }

}

export const createChannelsTable = async () => {
    let client: PoolClient | undefined;

    try {
        client = await pool.connect()
        await client.query('BEGIN')
        await client.query(CREATE_CHANNELS_FOR_USERS)
        await client.query('COMMIT')
        return true
    } catch (err) {
        console.log(err)
        return false
    }

}
const ENABLE_PGCRYPTO_EXTENSION: string = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
`;

export const createGuestTable = async () => {
    let client: PoolClient | undefined;
   
    try {
        client = await pool.connect()
        await client.query('BEGIN')
        await client.query(ENABLE_PGCRYPTO_EXTENSION)
        await client.query(CREATE_TABLE_GUESTS)
        await client.query('COMMIT')
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

export const createGuestChannels = async () => {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect()
        await client.query('BEGIN')
        await client.query(CREATE_CHANNELS_FOR_GUESTS)
        await client.query('COMMIT')
        return true
    } catch (err) {
        await client?.query('ROLLBACK')
        console.log(err)
        return false
    }
}
