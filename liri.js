require("dotenv").config();
const inquirer = require("inquirer");
const SpotifyNodeAPI = require("node-spotify-api");
var moment = require("moment");
const axios = require("axios");
const keys = require("./keys.js");
const spotify = new SpotifyNodeAPI(keys.spotify);
// const print = require("./print");
/**
 * Get the user input using Inquirer lib
 * @return {Promise} an Inquirer promise that resolves with
 * an answers object
 */
function getUserCmd() {
  return inquirer.prompt([
    {
      name: "cmd",
      message: "Liri here, How can I help you?",
      type: "list",
      choices: [
        "concert-this",
        "spotify-this-song",
        "movie-this",
        "do-what-it-says"
      ]
    },
    {
      name: "subject",
      message: "Enter your search:"
    }
  ]);
}
// eslint-disable-next-line valid-jsdoc
/**
 *
 */
function send2Api(answers) {
  let userInput;
  userInput = answers.subject;
  userInput = userInput.split(" ").join("+");


  switch (answers.cmd) {
    case "concert-this":
      send2Concert(userInput);
      break;

    case "spotify-this-song":
      send2Spotify(userInput);
      break;

    case "movie-this":
      send2Movie(userInput);
      break;

    default:
      // this is where the 'do-what-it-says' function will live
      // send2DoWhat();
      console.log(`CHILLLLLLLLL`);
      break;
  }
}

function send2Movie(userInput) {
  if (userInput === undefined) {
    userInput = encodeURIComponent("Mr Nobody");
  }

  url = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=trilogy`;

  return axios
    .get(url)
    .then(response => {
      var rd = response.data;
      console.log(
        `${rd.Title}\n
          Release Year: ${rd.Year}\n
          Staring: ${rd.Actors}\n
          IMDB Rating: ${rd.imdbRating} Rotten Tomatoe: ${rd.Ratings[1].Value}\n
          Country: ${rd.Country} Language: ${rd.Language}\n\n
          Plot: ${rd.Plot}\n`
      );
      console.log(url);
    })
    .catch(err => {
      console.log(err.message);
    });
}

function send2Concert(userInput) {
  let url;

  if (userInput === "") {
    userInput = "Wu-Tang Clan";
  }

  var showSelecta = encodeURIComponent(userInput);

  url = `https://rest.bandsintown.com/artists/${showSelecta}/events?app_id=codingbootcamp`;

  return axios
    .get(url)
    .then(response => {
      var rd = response.data;

      for (var loop = 0; loop < rd.length; loop++) {
        var show = rd[loop];
      }
      console.log(url);

      console.log(
        `Great Choice! Look at some upcoming shows I've found:\n
        The next show for ${userInput} is:\n
        Name of Venue: ${show.venue.name}\n
        Location: ${show.venue.region || show.venue.country}\n
        Date: ${ moment(show.datetime).format("MM/DD/YYYY")}\n
        Here are links for some tickets: ${show.url}`
      );
    })
    .catch(err => {
      console.log(err.message);
      return {};
    });
}

function send2Spotify(userInput) {
  function artistArray(artist){return artist.name;};
  var songSelecta = JSON.stringify(userInput);
  

  if (userInput === "") {
    userInput = "The Sign";
  }

  
  spotify.search({ type: "track", query: songSelecta, limit: 1 }, function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }
    console.log(songSelecta);    
    
    var songs = data.tracks.items;

    for (var i = 0; i < songs.length; i++) {
      console.log(`What a great song!\n
    Your song: ${songs[i].name} is from the album ${songs[i].album.name} by ${songs[i].artists.map(artistArray)} which was released on ${songs[i].album.release_date}.\n
    I found a preview for you to enjoy: ${songs[i].preview_url}\n
    --------------------------------------------------`);
      }
    }
  );
};

/**
 * The run function, makes the script go zoom.
 */
function run() {
  getUserCmd().then(send2Api);
  // .then(send2Print)
}

run();
