require("dotenv").config();
const inquirer = require("inquirer");
const SpotifyNodeAPI = require("node-spotify-api");
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
  if (userInput == "") {
    userInput = encodeURIComponent('Mr Nobody');
  }

  url = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=trilogy`;

  return axios
    .get(url)
    .then(response => {
      console.log(
      `${response.data.Title}\n
          Release Year: ${response.data.Year}\n
          IMDB Rating: ${response.data.imdbRating}\n
          Rotten Tomatoe: ${response.data.Rating}\n
          Country: ${response.data.Country}\n
          Language: ${response.data.Language}\n
          Plot: ${response.data.Plot}\n
          Actors: ${response.data.Actors}
          `);
          console.log(url);
          
    })
    .catch(err => {
      console.log(err.message);
    });
}

function send2Concert(userInput) {
  let url;

  if (userInput == "") {
    userInput = encodeURIComponent('Wu-Tang Clan');
  }

  url = `https://rest.bandsintown.com/artists/${userInput}/events?app_id=codingbootcamp`;

  return axios
    .get(url)
    .then(response => {
      console.log(url);
      console.log(
      `Name of Venue: ${response.data.Artist}\n
          Location: ${response.data.imdbRating}\n
          Date: ${response.data.Rating}\n`);

          
          
    })
    .catch(err => {
      console.log(err.message);
      return {};
    });
}


function send2Spotify(userInput) {
  if (userInput == "") {
    userInput = "The Sign";
  }
  spotify
    .search({ type: "track", query: userInput })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.log(err);
    });
}

/**
 * The run function, makes the script go zoom.
 */
function run() {
  getUserCmd()
  .then(send2Api);
  // .then(send2Print)
}

run();
