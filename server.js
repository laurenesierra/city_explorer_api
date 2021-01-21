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

app.get('/weather', (request, response) => {
  const key = process.env.WEATHER_API_KEY;
  const searchedCity = request.query.search_query;
  const latitude = request.query.latitude;
  const longitude = request.query.longitude;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchedCity}&key=${key}&days=8&lat=${latitude}&lon=${longitude}`;
  superagent.get(url)
    .then(result => {
      const theDataObjectFromWeatherJson = result.body.data;
      const allWeather = theDataObjectFromWeatherJson.map((val) => {
        return new Weather(val.weather.description, val.datetime);
      });

      response.send(allWeather);

    })
    .catch(error => {
      response.status(500).send('weather failed to load');
      console.log(error.message);
    });
});

app.get('/parks', (request, response) => {
  const key = process.env.PARKS_API_KEY;
  const searchedCity = request.query.search_query;
  const url = `https://developer.nps.gov/api/v1/parks?q=${searchedCity}&api_key=${key}&limit=5`;
  superagent.get(url)
    .then(result => {
      const parkInfo = result.body.data.map(obj => {
        const newParkObject = new Park(obj);
        console.log('thing', newParkObject);
        return newParkObject;
      });
      response.send(parkInfo);
    })
    .catch(error => {
      response.status(500).send('parks failed');
      console.log(error.message);
    });
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

function Park(obj) {
  this.name = obj.name;
  this.address = `${obj.addresses[0].line1} ${obj.addresses[0].city}, ${obj.addresses[0].stateCode} ${obj.addresses[0].postalCode}`;
  this.fee = obj.entranceFees[0].cost;
  this.description = obj.description;
  this.url = obj.url;
}
