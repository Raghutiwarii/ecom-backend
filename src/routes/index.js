import fastify from "fastify";
import { authRoutes } from "./authRoutes.js";
const prefix = "/api/v1";

export const registeredRoutes = async (fastify) => {
  fastify.register(authRoutes, { prefix: prefix });
};
