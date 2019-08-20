require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);


var getArtistNames = function (artist) {
    return artist.name;
};

var getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "Wish you were here";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error:" + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s);" + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song; " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----");
            }
        }
    );
};

var getMyBands = function (artist) {
    var artistURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(artistURL).then(
        function (responce) {
            var jsonData = responce.data;

            if (!jsonData.length) {
                console.log("no results found with" + artist + "name" + ":");
                return;
            }

            console.log("Upcoming concerts for " + artist + ":");

            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];




                console.log(
                    show.venue.city +
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " +
                    show.venue.name +
                    " " +
                    moment(show.datatime).format("MM/DD/YYY")
                );
            }
        }
    );
};


var getMyMovie = function (movieName) {
    if (movieName === undefined) {
        movieName = "Star Wars";
    }

    var urlMovie = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";


    axios.get(urlMovie).then(
        function (response) {
            var jsonData = response.data;

            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Rotten Tomatoes Rating" + jsonData.Ratings[1].Value);
            console.log("Country: " + jsonData.country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
        }
    );
};


var doSomething = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
}


var pick = function (caseData, functionData) {
    switch (caseData) {
        case "concert-this":
            getMyBands(functionData);
            break;
        case "spotify-this-song":
            getMeSpotify(functionData);
            break;
        case "movie-this":
            getMyMovie(functionData);
            break;
        case "Do-Something":
            doSomething();
            break;
        default:
            console.log("I dont know what you want...");
    }
};


var run = function (argOne, argTwo) {
    pick(argOne, argTwo);
};



run(process.argv[2], process.argv.slice(3).join(" "));