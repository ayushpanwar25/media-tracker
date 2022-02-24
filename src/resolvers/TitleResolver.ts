import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Title } from "../entities/Title";
import { MyContext } from "../types/context";

@Resolver()
export class TitleResolver {
  @Query(() => [Title])
  titles(@Ctx() { connection }: MyContext): Promise<Title[]> {
    return connection.getRepository(Title).find();
  }

  @Query(() => Title)
  title(
    @Ctx() { connection }: MyContext,
    @Arg("tvdb", () => Int) tvdb: number
  ): Promise<Title | undefined> {
    return connection.getRepository(Title).findOne(tvdb);
  }

  @Mutation(() => Title)
  async createTitle(
    @Ctx() { connection }: MyContext,
    @Arg("imdb") imdb: string,
    @Arg("tvdb", () => Int) tvdb: number
  ): Promise<Title> {
    const title = await connection.getRepository(Title).findOne(tvdb);
    if (title) {
      throw new Error("Title already exists");
    }
    return connection.getRepository(Title).save({
      imdb,
      tvdb
    });
  }
}
