import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { UserResolver } from "./resolvers/UserResolver";
import { TitleResolver } from "./resolvers/TitleResolver";

const main = async () => {
  const redisStore = connectRedis(session);
  const redisClient = redis.createClient();

  const connection: Connection = await createConnection();
  await connection.synchronize(); //change in production

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, TitleResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ db: connection, req, res })
  });

  await apolloServer.start();

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: true
    })
  );
  app.use(
    session({
      name: "connectid",
      store: new redisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      },
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT, () => {
    console.log("🚀 Listening on port 3001");
  });
};

main().catch((error) => console.log(error));
