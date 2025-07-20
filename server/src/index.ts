import { connectMongoDb } from "./config/env.config.js";
import { createServer } from "./server.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongoDb();
  const app = createServer();

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
};

startServer();
