import {Resolver, Query, Ctx, Arg, Int} from "type-graphql";
import {Title} from "../entities/Title";
import {MyContext} from "../types";

@Resolver()
export class TitleResolver {
    @Query(() => [Title])
    titles(@Ctx() {connection}: MyContext): Promise<Title[]> {
        return connection.getRepository(Title).find();
    }

    @Query(() => Title)
    title(
        @Ctx() {connection}: MyContext,
        @Arg("tvdb", () => Int) tvdb: number): Promise<Title | undefined> {
        return connection.getRepository(Title).findOne(tvdb);
    }
}