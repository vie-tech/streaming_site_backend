const RedisStore = require("connect-redis").default
const {createClient} = require('redis')

const redisClient = createClient({
    password: 'q6NgJZMQTFCKj3MoGznvWhrADV3iovf9',
    socket: {
        host: 'redis-13243.c92.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 13243
    }
});

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "adultsite:",
  })

  redisClient.on('connect', ()=>{
    console.log('Connected to Redis');
})


  module.exports = {redisStore}