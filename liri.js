require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require('./keys');
var request = require('request');
var fs = require('fs')

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//take terminal inputs
var input1 = process.argv[2]
if (process.argv[3]){
  var input2 = process.argv[3]
}else{
  var input2 = ""
}

//assess the request
function assessInput(input1, input2){

  switch (input1) {

    case 'my-tweets':
      twitterResult()
      break;

    case 'movie-this':
      if (input2 != ""){
        var movie = input2
      } else{
        var movie = "Mr. Nobody"
      }
      movieResult(movie)
      break;

    case 'spotify-this-song':
      if (input2 != ""){
        var song = input2
      } else{
        song = "The Sign: Ace of Base"
      }
      spotifyResult(song)
      break;

    case 'do-what-it-says':
      whatItSays()
      break;

    default:
      console.log("sorry, i didnt get that")

  }
}


//SPOTIFY FUNCTION
function spotifyResult(song) {
  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

  console.log("Artist: " + data.tracks.items[0].artists[0].name);
  console.log("Song: " + data.tracks.items[0].name);
  console.log("Preview: " + data.tracks.items[0].preview_url);
  console.log("Album: "+data.tracks.items[0].album.name);
  });
}

//MOVIE FUNCTION
function movieResult(movie) {
  request('http://www.omdbapi.com/?i=tt3896198&apikey=2306be69&t='+movie, function (error, response, body) {
    // body to JSON
    var result = JSON.parse(body)
    if(result.Title != undefined){
    console.log('Title: '+ result.Title);
    console.log('Released: '+ result.Released);
    console.log('IMDB Rating: '+ result.Ratings[0].Value);
    console.log('Rotten Tomaotes Rating: '+ result.Ratings[1].Value);
    console.log('Country: '+ result.Country);
    console.log('Language: '+ result.Language);
    console.log('Plot: '+ result.Plot);
    console.log('Actors: '+ result.Actors);
  }else{
    console.log("invalid movie")
  }
});
}

//TWITTER FUNCTION
function twitterResult() {
  var params = {screen_name: 'DD_TEST_ACCT'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for (var x = 0; x < Math.min(tweets.length, 20); x++ )
        console.log(tweets[x].text);
      }
    });
}

//WHAT-IT-SAYS FUNCTION
function whatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    assessInput(dataArr[0], dataArr[1])
  });
}

assessInput(input1, input2)
