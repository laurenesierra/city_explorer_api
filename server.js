'use strict';

//packages
const express = require('express');

const cors = require('cors');

require('dotenv').config();


// app set up
const app = express();

app.use(cors());

//other global variables
const PORT = process.env.PORT || 3001;

//routes
app.get('/' , (request, response) => {
  response.send('heyyyyy');
});

app.get('/pet-the-pet', (req, res) => {
  res.send('about to pet');
});

//start server
app.listen(PORT, () => console.log(`we are up on port ${PORT}`));
