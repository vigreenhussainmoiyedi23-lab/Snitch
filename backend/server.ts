import app from "./src/app.js";
import { config } from "./src/config/config.js";
import ConnectToDatabase from "./src/config/database.js";
import { connectRedis } from "./src/config/redis.js";
ConnectToDatabase()
connectRedis()
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
