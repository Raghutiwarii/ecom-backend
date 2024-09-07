import fastify from "fastify";
import {
  doRefreshToken,
  fetchUser,
  loginCustomer,
  loginDeliveryPartner,
  updateUser,
} from "../controllers/auth/authControllers.js";
import { verifyToken } from "../middlewares/auth.js";

export const authRoutes = async (fastify, options) => {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/deliveryPartner/login", loginDeliveryPartner);
  fastify.post("/refresh-token", doRefreshToken);
  fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
  fastify.post("/user", { preHandler: [verifyToken] }, updateUser);
};
