require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

// Homepage route
app.get('/', (req,res) => {
    res.render('index')
})

  // Artist-search route
  
   app.get ('/artist-search', (req,res)=>{
   spotifyApi.searchArtists(req.query.artistName)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render ('artist-search-results',{artists: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
   })

  //Artist Albums
  app.get('/albums/:artistId', (req,res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then (data => {
    //console.log('Artist albums', data.body.items);
    res.render ('albums',{albums: data.body.items})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
  })

  //View Tracks
  app.get('/tracks/:trackId', (req,res)=>{
    spotifyApi.getAlbumTracks (req.params.trackId)
    .then (data=> {
      console.log ('received data from the API:',  data.body.items)
    res.render ('tracks', {tracks: data.body.items})
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
  })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
