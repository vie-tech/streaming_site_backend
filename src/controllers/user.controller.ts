import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/database.config';
import { v4 as uuidV4 } from 'uuid';
import { createUsersTable, createChannelsTable } from '../database/table.management';
import { AuthenticatedRequest, SignupRequestBody } from '../interface/interface';
import {
  SEARCH_QUERY_SIGNUP,
  INSERT_QUERY_SIGNUP,
  INSERT_QUERY_CREATE_CHANNEL,
  SEARCH_LOGIN_QUERY,
  UPDATE_CHANNEL_STATUS
} from '../database/query';
import { responseHandler } from '../handlers/response.handler.js';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from '../helper/hashing.js';
import { Pool, PoolClient } from 'pg';

dotenv.config();

const userSignup = async (req: Request, res: Response): Promise<void> => {
  let client: PoolClient | undefined
  const user_table_created = await createUsersTable()
  const channel_table_created = await createChannelsTable()
  if (!user_table_created || !channel_table_created) {

    return responseHandler.error(res, 'Issue with creating user table')
  }
  try {
    client = await pool.connect();
    await client.query('BEGIN')
    const { username, email, password, age } = req.body as SignupRequestBody;

    // Check if user already exists
    const userAlreadyExists = await client.query(SEARCH_QUERY_SIGNUP, [email]);
    if (userAlreadyExists?.rowCount !== 0) {
      await client.query('ROLLBACK')
      return responseHandler.badrequest(res, 'User already exists');
    }

    // Create a new user instance
    const hostId = uuidV4();
    const channelName = `CHANNEL_${username}_${hostId}`;
    const hashedPassword = await hashPassword(password)
    const user = await client.query(INSERT_QUERY_SIGNUP, [username, email, age, hashedPassword, hostId])
    const id: number = user.rows[0].id
    await client.query(INSERT_QUERY_CREATE_CHANNEL, [channelName, id])


    // Generate JWT token
    const token = jwt.sign(
      { id },
      process.env.JWT_PASSKEY || '',
      { expiresIn: '24hr' }
    );

    if (!token) {
      await client.query('ROLLBACK')
      return responseHandler.invalidToken(res);
    }

    await client.query('COMMIT')
    responseHandler.created(res, {
      message: "Congratulations, you've been signed up",
      channelName,
    }, token);
  } catch (err) {
    await client?.query('ROLLBACK')
    if (err instanceof Error) {
      console.log(err.message);
      responseHandler.error(res, err.message);
    }

  } finally {
    client?.release()
  }
};





const userLogin = async (req: Request, res: Response): Promise<void> => {

  interface RequestBody {
    email: string,
    password: string
  }

  let client: PoolClient | undefined

  try {
    client = await pool.connect();
    await client.query('BEGIN')
    const { email, password } = req.body as RequestBody;

    // Find user by email
    const user = await client.query(SEARCH_LOGIN_QUERY, [email]);
    if (user.rowCount == 0) {
      await client.query('ROLLBACK')
      return responseHandler.badrequest(res, 'Invalid email or password');
    }

    const account = user.rows[0]
    // Validate user password
    const validPassword = await comparePassword(password, account.password)
    if (!validPassword) {
      await client.query('ROLLBACK')
      return responseHandler.badrequest(res, 'Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: account.id },
      process.env.JWT_PASSKEY || '',
      { expiresIn: '24hr' }
    );

    if (!token) {
      await client.query('ROLLBACK')
      return responseHandler.invalidToken(res);
    }

    await client.query('COMMIT')
    responseHandler.created(res, {
      message: `Welcome back ${account.username}`,
      user: account.username,
      user_host_id: account.hostId,
    }, token);
  } catch (err) {

    await client!.query('ROLLBACK')


    console.error(err);
    responseHandler.error(res, 'Token could not be generated');
  } finally {

    client?.release()


  }
};


const getJwtTokenForUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  let client: PoolClient | undefined
  try {
    const userFromMiddleware = req?.user
    client = await pool.connect()
    await client.query('BEGIN')
    if (!userFromMiddleware) {
      return responseHandler.error(res, 'Nothing gotten from middleware');
    }

    const userId = req.query?.userId;

    if (!userId) {
      return responseHandler.error(res, 'User id not found');
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
    const token = jwt.sign(payload, "c6vj2dp2v9a6du7u2cnhembzc3r8k8z958rkabhw2nqvph93jfv2su94sfvtd5t2", options);
    if (!token) {
      return responseHandler.error(res, 'Invalid JWT token');
    }

    // Find channel for the user and update isLive status
    const userChannel = await client.query(UPDATE_CHANNEL_STATUS, [userFromMiddleware.id]);
    if (userChannel.rowCount === 0) {
      throw new Error('Could not update user channel status')
    }


    // Send success response with token and channel name
    responseHandler.ok(res, { token, channelName: userChannel.rows[0].channel_name });
  } catch (err) {
    if (err instanceof Error) {
      await client?.query('ROLLBACK')
      console.error(err);
      responseHandler.error(res, err?.message);
    }

  }finally{
    client?.release()
  }
};




export const userController = {
  userSignup,
  userLogin,
  getJwtTokenForUser,
};
