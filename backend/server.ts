console.time("server Preprations");
import app from "./src/app.js";
import { config } from "./src/config/config.js";
import ConnectToDatabase from "./src/config/database.js";
import { connectRedis } from "./src/config/redis.js";
import { validateGoogleAuth } from "./src/config/validateGoogle.js";
await Promise.all([ConnectToDatabase(), connectRedis(), validateGoogleAuth()]);
console.timeEnd("server Preprations");
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
