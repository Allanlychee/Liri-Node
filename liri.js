require("dotenv").config()

var userInput = process.argv[2] //determine if Spotify/Twitter/OMBD as initial request
var getKeys = require("./keys.js")
var fs = require("fs")

/* User Request */
var arr = process.argv.splice(3, process.argv.length) //to turn user input greater than process.argv[3] into string
var str = ""
for (var i = 0; i < arr.length; i++) {
    str += " " + arr[i]
}

/* Twitter */
if (userInput === "my-tweets") {
    var Twitter = require("twitter")
    var client = new Twitter(getKeys.twitter)
    var params = { screen_name: 'lychee_allan' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(err)
        }

        else {
            var myTweets = ""

            for (var i = 0; i < tweets.length; i++) {
                var tweetArr = tweets[i]

                myTweets = tweets[i].text
                console.log('===========TWEET ' + i + '============')
                console.log(myTweets)
            }
        }
    })
}
/* Spotify */
else if (userInput === "spotify-this-song") {
    
    if (str === "") {
		str = "The Sign Ace"
        spotify()
    }
    else {
        spotify()
    }
}

/* OMBD */
else if (userInput === "movie-this") {
    /* ===============================================================================================
    REQUEST USED FOR APIS WITH NO NPM PACKAGE, SUCH AS OMBD */
    if (str === '') {
        str = 'Mr.Nobody'
    }
    var request = require('request')

    request('http://www.omdbapi.com/?apikey=' + getKeys.omdb.apikey + '&t=' + str, function (error, response, body) {

        parse = JSON.parse(body)
        // console.log(parse)
        console.log("======== Your Movie Information =========")

        console.log("Title: " + parse.Title)
        console.log("Year: " + parse.Year)
        console.log("IMDB Rating: " + parse.imdbRating)
        if (parse.Ratings[1] === undefined) {
            console.log("Rotten Tomatoes: N/A")
        }
        else {
            console.log("Rotten Tomatoes: " + parse.Ratings[1].Value)
        }
        console.log("Country: " + parse.Country)
        console.log("Language: " + parse.Language)
        console.log("Plot: " + parse.Plot)
        console.log("Actors: " + parse.Actors)
        console.log("=========================================")
    })
}


/* I want it that way*/
else if (userInput === "do-what-it-says") {
    // run spotify-this-song for "I Want it That Way"
    fs.readFile("random.txt", "utf8", function (error, data) {
        str = data
        spotify()
    })
}

/* Spotify function */
function spotify() {
    var Spotify = require("node-spotify-api")
    // var songFound = false
    var spotify = new Spotify({
        id: getKeys.spotify.id,
        secret: getKeys.spotify.secret
    })

    spotify.search({ type: 'track', query: str }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {
            console.log("======== Your Song Information =========")
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name) // artist
            console.log("Song: " + data.tracks.items[0].name) // song name
            console.log("Link: " + data.tracks.items[0].external_urls.spotify) // link to song
            console.log("Album: " + data.tracks.items[0].album.name) // album name
            console.log("=========================================")
        }
        
    })
}