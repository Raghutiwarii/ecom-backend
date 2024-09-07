import fastify from "fastify";
import connectDB from "./src/config/connect.js";
import "dotenv/config";
import { PORT } from "./src/config/config.js";
import { buildAdminRouter } from "./src/config/setup.js";
import { registeredRoutes } from "./src/routes/index.js";

const start = async () => {
  await connectDB();
  const app = fastify();
  await registeredRoutes(app);
  await buildAdminRouter(app);
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, res) => {
    if (err) {
      console.log("error while starting the server");
    } else {
      console.log(`server started at port ${PORT}`);
      console.log("second args ", res);
    }
  });
};

start();
