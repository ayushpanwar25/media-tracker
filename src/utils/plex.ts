import dotenv from "dotenv";
dotenv.config();
import { PythonShell } from "python-shell";

export const playMedia = async (
  serverUri?: string,
  token?: string,
  client?: string,
  tvdbId?: number,
  type?: "TV Shows" | "Movies",
  season?: number,
  episode?: number
): Promise<any> => {
  const shell = PythonShell.run(
    "src/utils/python-plexapi/playMedia.py",
    {
      /* args: [
        serverUri,
        token,
        client,
        tvdbId.toString(),
        type,
        season.toString() + "." + episode.toString()
      ] */
      args: [
        "http://192.168.0.10:32400",
        process.env.PLEX_TOKEN!,
        "PC11460",
        "270915",
        "TV Shows",
        "6.1"
      ]
    },
    function (err, res) {}
  );
  shell.on("error", function (err) {
    return false;
  });
  shell.on("stderr", function (err) {
    return false;
  });
  shell.on("pythonError", function (err) {
    return false;
  });
  shell.on("message", function (err) {
    return true;
  });
};

async function main() {
  const r = await playMedia();
  console.log(r);
}
main();

/*
import { getServers, getPlayers, playMedia } from "./plex";
import PlexAPI from "plex-api"; //no types :(
 const plex = {
  pms: new PlexAPI({
    hostname: "192.168.0.10",
    token: process.env.PLEX_TOKEN,
    options: {
      identifier: "abcd1234"
    }
  }),
  web: new PlexAPI({
    hostname: "plex.tv",
    port: 443,
    https: true,
    token: process.env.PLEX_TOKEN,
    options: {
      identifier: "abcd1234",
      product: "mt",
      version: "2.2.4"
    }
  })
};

async function main() {
  const servers = await getServers(plex);
  const players = await getPlayers(plex);
  const res = await playMedia(plex, {
    mediaKey: "/library/metadata/378"
  });
}
main(); */

/* const plexServer = new PlexAPI({
  hostname: "192.168.0.10",
  token: process.env.PLEX_TOKEN,
  options: {
    identifier: "abcd1234"
  }
});

const plexWeb = new PlexAPI({
  hostname: "plex.tv",
  port: 443,
  https: true,
  token: process.env.PLEX_TOKEN,
  options: {
    identifier: "abcd1234",
    product: "mt",
    version: "2.2.4"
  }
});

//after getting auth token and serverID, get library sections

const IdandKeys = async () => {
  const sections = await plexServer.query("/library/sections");
  const tvKey = sections.MediaContainer.Directory.find(
    (section) => section.type === "show"
  ).key;
  const shows = await plexServer.query(
    `/library/sections/${tvKey}/all/?includeGuids=1`
  );
  console.log(shows.MediaContainer.Metadata);
  const map = new Map();
  shows.MediaContainer.Metadata.forEach((show) => {
    map.set(parseInt(show.Guid[2].id.slice(7)), parseInt(show.ratingKey));
  });
  return map;
};

IdandKeys(); */
