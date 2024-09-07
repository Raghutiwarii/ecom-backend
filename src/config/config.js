import "dotenv/config";
import fastifySession from "@fastify/session";
import connectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

const MongoDBStore = connectMongoDBSession(fastifySession);
export const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

sessionStore.on("error", (err) => {
  console.log("error while connecting mongoDB session ", err);
});

export const authenticate = async (email, password) => {
  if (email && password) {
    const user = await Admin.findOne({ email });
    if (!user) return null;
    if (user.password === password) {
      return new Promise({
        email: email,
        password: password,
      });
    } else return null;
  }
};

export const PORT = process.env.PORT || 8000;

export const cookiePassword = process.env.COOKIES_PASS;
