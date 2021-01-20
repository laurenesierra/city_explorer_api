'use strict';

//packages
const express = require('express');

const cors = require('cors');
const { response } = require('express');

require('dotenv').config();
const superagent = require('superagent');


// app set up
const app = express();

app.use(cors());

//other global variables
const PORT = process.env.PORT || 3001;

//routes
app.get('/location', (request, response) => {
  if (request.query.city === '') {
    response.status(500).send('Please enter a valid city...');
    return;
  }

  // const theDataArrayFromTheLocationJson = require('./data/location.json');
  // const theDataObjectFromJson = theDataArrayFromTheLocationJson[0];



  const searchedCity = request.query.city;
  const key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${searchedCity}&format=json`;
  superagent.get(url)
    .then(result => {
      // console.log(result.body[0]);
      const theDataObjectFromJson = result.body[0];
      const newLocation = new Location(
        searchedCity,
        theDataObjectFromJson.display_name,
        theDataObjectFromJson.lat,
        theDataObjectFromJson.lon
      );
      console.log(newLocation);
      response.send(newLocation);
    })
    .catch(error => {
      response.status(500).send('locationiq failed');
      console.log(error.message);
    });
});

// const newLocation = new Location(
//   searchedCity,
//   theDataObjectFromJson.display_name,
//   theDataObjectFromJson.lat,
//   theDataObjectFromJson.lon
// );


app.get('/weather', (request, response) => {
  const theDataArrayFromTheWeatherJson = require('./data/weather.json');
  const theDataObjectFromWeatherJson = theDataArrayFromTheWeatherJson.data;
  const allWeather = theDataObjectFromWeatherJson.map((val) => {
    return new Weather(val.weather.description, val.datetime);
  });
  response.send(allWeather);

});

//start server
app.listen(PORT, () => console.log(`we are up on port ${PORT}`));

//helper functions

function Location(search_query, formated_query, latitude, longitude) {
  this.search_query = search_query;
  this.formated_query = formated_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}


