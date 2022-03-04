//@ts-nocheck
const hostname = "192.168.0.10";
const identifier = "abcd1234";

import dotenv from "dotenv";
dotenv.config();

import PlexAPI from "plex-api"; //no types :(

//TODO add auth on front end and store token in db
//plex.tv/api/resources

const plex = new (PlexAPI as any)({
  hostname: hostname,
  token: process.env.PLEX_TOKEN,
  options: {
    identifier: identifier
  }
});

const fetchTVData = async () => {
  const sections = await plex.query("/library/sections");
  const tvKey = sections.MediaContainer.Directory.find(
    (section) => section.type === "show"
  ).key;
  const shows = await plex.query(
    `/library/sections/${tvKey}/all/?includeGuids=1`
  );
  const ids = [];
  shows.MediaContainer.Metadata.forEach((show) => {
    ids.push(show.Guid[2].id.slice(7));
  });
  return ids;
};

console.log(fetchTVData());
