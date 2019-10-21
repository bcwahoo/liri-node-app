require("dotenv").config();
const SpotifyNodeAPI = require("node-spotify-api");
const keys = require("./keys.js");
const spotify = new SpotifyNodeAPI(keys.spotify);
var userInput = 'You make me wanna';

var getMeSpotify = function (songName) {
    
    

    if (songName === undefined) {
      songName = "You Make me wanna";
    }
  
    spotify.search({ type: "track", query: songName, limit: 1 }, function (err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      console.log(songName + '\n');
    function artistArray(artist){
        return artist.name;
    };
      var songs = data.tracks.items;
      var data = [];
    
  
      for (var i = 0; i < songs.length; i++) {
        data.push({
          "artist(s)": songs[i].artists.map(artistArray),
          "song name: ": songs[i].name,
          "preview song: ": songs[i].preview_url,
          "album: ": songs[i].album.name
        });
      }
  
      console.log(data);
    //   writeToLog(data);
    });
  };
  
  getMeSpotify();
