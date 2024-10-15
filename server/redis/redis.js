const { createClient } = require("redis");

const redis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redis.connect(); // This will establish the connection to Redis

module.exports = redis;
