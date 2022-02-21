import {createConnection, Connection} from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema} from "type-graphql";
import express from "express";
import cors from "cors";
//import {Title} from "./entities/Title";
//import {User} from "./entities/User";
//import { UserResolver } from "./resolvers/UserResolver";
import { TitleResolver } from "./resolvers/TitleResolver";

const main = async () => {

    const connection: Connection = await createConnection();
    await connection.synchronize();

    /*const t1 = new Title();
    t1.tvdb = 396390;
    t1.imdb = "tt13991232";
    await connection.manager.save(t1);

    const t2 = new Title();
    t2.tvdb = 82066;
    t2.imdb = "tt1119644";
    await connection.manager.save(t2);

    const u1 = new User();
    u1.username = "test11";
    u1.password = "test2";
    u1.email = "test3";
    u1.titles = [t1, t2];
    await connection.manager.save(u1);*/

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [TitleResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ connection, req, res })
    });

    await apolloServer.start();

    const app = express();
    app.use(cors({
        credentials: true,
        origin: "https://studio.apollographql.com"
    }));

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
};

main().catch(error => console.log(error));
