import { responseHandler } from "../handlers/response.handler"
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import pool from '../database/database.config';
import {
  DELETE_GUEST,
  INSERT_GUEST_QUERY, 
  GET_ALL_LIVE_GUEST_CHANNEL,
  UPDATE_GUEST_CHANNEL_STATUS,
  INSERT_GUEST_CHANNEL_QUERY
} from '../database/query.js'
import { Request, Response } from 'express';
import { PoolClient } from "pg";
import { createGuestChannels, createGuestTable } from '../database/table.management';
import dotenv from 'dotenv'


dotenv.config()

const jwtPasskey = process.env.JWT_PASSKEY || "default"

const getTemporaryGuestId = async (req: Request, res: Response) => {
  console.log("Guest function running");
  const uuidValue = uuid();
  const temporaryGuestId = `guest_user_${uuidValue}`
  if (!temporaryGuestId) {
    throw new Error('Could not generate temporary guestId')
  }
  let client: PoolClient | undefined
  try {

    const create_guest_table = await createGuestTable()

    if (!create_guest_table) {
      throw new Error('Could not create table')
    }

    const create_guest_channel_table = await createGuestChannels()
    if (!create_guest_channel_table) {
      throw new Error('Could not create table for guest channel')
    }
    client = await pool.connect()
    await client.query('BEGIN')
    const guest = await client.query(INSERT_GUEST_QUERY, [temporaryGuestId])

    const guest_channel = await client.query(INSERT_GUEST_CHANNEL_QUERY, [guest.rows[0].guest_name])
    console.log(guest_channel.rowCount)

    if (guest_channel.rowCount == 0) {
      throw new Error('Could not create guest channel please sign in instead')
    }

    responseHandler.ok(res, {
      guest_channel: guest_channel.rows[0].channel_name,
      guest_id: temporaryGuestId,
    })
    await client.query('COMMIT')
  } catch (err) {
    console.log(err)
    await client?.query('ROLLBACK')
    if (err instanceof Error) {
      console.log(err)
      responseHandler.error(res, err.message)
    }
  } finally {
    client?.release()
  }

};






const getAllGuestLiveStreams = async (req: Request, res: Response) => {
  let client;
  const guestChannels = await createGuestChannels()
  if (!guestChannels) {
    throw new Error('Could not create guest channels table')
  }
  try {
    client = await pool.connect()
    await client.query('BEGIN')
    const channels = await client.query(GET_ALL_LIVE_GUEST_CHANNEL)
    await client.query('COMMIT')
    responseHandler.ok(res, {
      channels: channels.rows,
    })
  } catch (err) {
    await client?.query('ROLLBACK')
    if (err instanceof Error) {
      responseHandler.error(res, err.message)
    }
  } finally {
    client?.release()
  }
};



const getJwtTokenForGuest = async (req: Request, res: Response) => {

  let client: PoolClient | undefined
  const { userId } = req?.query;
  if (!userId) {
    throw new Error('User ID not passed found')
  }

  try {
    client = await pool.connect()
    await client.query('BEGIN')
    const payload = {
      user_id: userId,
    };
    const options = {
      expiresIn: "1h",
      issuer: "my_app_url", //REPLACE THIS WITH THE APP URL
    };
    const secretKey = "c6vj2dp2v9a6du7u2cnhembzc3r8k8z958rkabhw2nqvph93jfv2su94sfvtd5t2";
    const token = jwt.sign(payload, secretKey, options);
    if (!token) {
      throw new Error('Could not create JWT token')
    };

    const user = await client.query(UPDATE_GUEST_CHANNEL_STATUS, [true, userId])
    if (!user) {
      throw new Error('Could not update user status')
    }
    await client.query('COMMIT')
    responseHandler.ok(res, { token });

  } catch (err) {
    await client?.query('ROLLBACK')
    if (err instanceof Error) {
      responseHandler.error(res, err.message)
    }
  } finally {
    client?.release()
  }

};



const endGuestHostCall = async (req: Request, res: Response) => {
  let client: PoolClient | undefined
  const { guestId } = req?.query
  try {
    client = await pool.connect()
    await client.query('BEGIN')
    await client.query(DELETE_GUEST, [false, guestId])
    await client.query('COMMIT')
    responseHandler.ok(res, { message: 'done' })
  } catch (err) {
    await client?.query('ROLLBACK')
    if (err instanceof Error) {
      responseHandler.error(res, err.message)

    }
  } finally {
    client?.release()
  }

}


export const guestController = {
  getTemporaryGuestId,
  getAllGuestLiveStreams,
  getJwtTokenForGuest,
  endGuestHostCall
};
