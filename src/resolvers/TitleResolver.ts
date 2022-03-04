import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Title } from "../entities/Title";
import { MyContext } from "../types/context";

@Resolver()
export class TitleResolver {
  @Query(() => [Title])
  titles(@Ctx() { db }: MyContext): Promise<Title[]> {
    return db.getRepository(Title).find();
  }

  @Query(() => Title)
  title(
    @Ctx() { db }: MyContext,
    @Arg("tvdb", () => Int) tvdb: number
  ): Promise<Title | undefined> {
    return db.getRepository(Title).findOne(tvdb);
  }

  @Mutation(() => Title)
  async createTitle(
    @Ctx() { db }: MyContext,
    @Arg("imdb") imdb: string,
    @Arg("tvdb", () => Int) tvdb: number
  ): Promise<Title> {
    const title = await db.getRepository(Title).findOne(tvdb);
    if (title) {
      throw new Error("Title already exists");
    }
    return db.getRepository(Title).save({
      imdb,
      tvdb
    });
  }
}
