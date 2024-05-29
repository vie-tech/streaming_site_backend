const express = require("express");
const cors = require("cors");
const app = express();
const session = require('express-session')
const {redisStore} = require('../cache/redis.client')
const cookieParser = require('cookie-parser');
const routes = require('../router/index.route').routes
require('dotenv').config()
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use('/api', routes)


app.use(cookieParser())

app.use(express.urlencoded({ extended: false }));
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))



module.exports = {app}