'use strict';

//packages
const express = require('express');

const cors = require('cors');
const { response } = require('express');

require('dotenv').config();


// app set up
const app = express();

app.use(cors());

//other global variables
const PORT = process.env.PORT || 3001;

//routes
app.get('/location', (request, response) => {
  const theDataArrayFromTheLocationJson = require('./data/location.json');
  console.log(theDataArrayFromTheLocationJson);
  const theDataObjectFromJson = theDataArrayFromTheLocationJson[0];
  console.log(theDataObjectFromJson);

  console.log('request.query', request.query);

  const searchedCity = request.query.city;

  const newLocation = new Location(
    searchedCity,
    theDataObjectFromJson.display_name,
    theDataObjectFromJson.lat,
    theDataObjectFromJson.lon
  );

  response.send(newLocation);
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


