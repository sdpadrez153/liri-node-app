require("dotenv").config();
const fs = require("fs");

const keys = require("./keys.js");
const moment = require("moment");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);


var proc1 = process.argv[2];
var proc2 = process.argv.splice(3).join('+');




function concertThis() {
  if (proc1 === 'concert-this') {
    axios
      .get("https://rest.bandsintown.com/artists/" + proc2 + "/events?app_id=codingbootcamp")
      .then(function (response) {
        // console.log(response.data);

        for (let i = 0; i < response.data.length; i++) {
          const venue = response.data[i].venue.name
          const city = response.data[i].venue.city

          const date = response.data[i].datetime
          const formatDate = moment(date);

          console.log(venue + ', ' + city + ', ' + formatDate.format('MM/DD/YY'));
        }
      })
  };
}


function movieThis() {
  if (proc1 === 'movie-this') {
    if (proc2 === "") {
      proc2 = "mr+nobody"
    }
    axios.get("http://www.omdbapi.com/?t=" + proc2 + "&y=&plot=short&apikey=trilogy").then(
      function (response) {
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating" + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      });
  };
}

function spotifyThisSong() {
  if(proc1 === "spotify-this-song"){
    if(proc2 === ""){
      proc2 = "The Sign, Ace of Base"
    }
  }
  spotify.search({ type: 'track', query: proc2 }, function (err, data) {
    if (err) {
      return console.log(err);
    }

    console.log("The artist:" + data.tracks.items[0].artists[0].name);

    console.log("The Song:" + data.tracks.items[0].name);

    console.log("Link:" + data.tracks.items[0].preview_url);

    console.log("The Album:" + data.tracks.items[0].album.name);
  });

}

function doWhatItSays() {
  fs.readFile('random.txt', "utf8", function (err, data) {
    let dataArray = data.split(",");
    proc1 = dataArray[0];
    proc2 = dataArray[1];
    spotifyThisSong(proc1);
  });
}


switch (proc1) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("type in an option");
};




