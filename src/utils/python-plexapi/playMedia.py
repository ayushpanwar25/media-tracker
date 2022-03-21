"""
<player_url> <token> <player_name> <tvdb> <type> <ep>
"""
import sys
from plexapi.server import PlexServer
baseurl = sys.argv[1]
token = sys.argv[2]
plex = PlexServer(baseurl, token)
section = plex.library.section(sys.argv[5])
title = section.getGuid('tvdb://' + sys.argv[4])
media = title
if sys.argv[6]:
    season, episode = sys.argv[6].split('.')
    media = title.episode(None, int(season), int(episode))
client = plex.client(sys.argv[3])
client.playMedia(media)