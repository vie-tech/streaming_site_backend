import express from 'express'
import cors from 'cors'
import session from 'express-session'
/* import {redisStore} from '../cache/redis.client.js'
 */import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import routes from '../router/index.route.js'


 const app = express();

dotenv.config()
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use('/api', routes)




app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))


export default app