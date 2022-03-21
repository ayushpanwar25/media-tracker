import {
    Resolver,
    Query,
    Mutation,
    InputType,
    Field,
    Arg,
    Ctx,
    ObjectType
  } from "type-graphql";
  import { User } from "../entities/User";
  import { MyContext } from "../types/context";
  import { playMedia } from "src/utils/plex";
  
  @Resolver()
  export class PlexResolver {
    @Query(() => Boolean)
    async play(
      @Arg("data")
      data: {
        client: string;
        tvdbId: number;
        type: "TV Shows" | "Movies";
        season?: number;
        episode?: number;
      },
      @Ctx() { req, db }: MyContext
    ): Promise<boolean> {
      if (!req.session.userId) return false;
      const user = await db
        .getRepository(User)
        .findOne({ id: req.session.userId });
      if (!user || !user.plexToken) return false;
      const token = user.plexToken;
      const serverUri = user.serverUri;
      const res = await playMedia(
        serverUri,
        token,
        data.client,
        data.tvdbId,
        data.type,
        data.season,
        data.episode
      );
      if (res) {
        return true;
      } else {
        return false;
      }
    }
  }