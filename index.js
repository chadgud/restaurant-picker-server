const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config({ path: './.env' });
const app = express();

const corsOptions = {
    origin: ['https://frosty-franklin-cbd13f.netlify.app', 'https://dinnerdecider.chadgud.dev', 'http://localhost:3000'],
    optionsSuccessStatus: 200
}

app.use('/', cors(corsOptions), (req, res, next) => {
    const { lat, lon } = req.query;

    const reqConfig = {
        method: 'get',
        headers: {
            Accept: 'application.json',
            Authorization: process.env.FOURSQUARE_API_KEY
        },
        params: {
            ll: `${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`,
            radius: '11265',
            categories: '13065',
            fields: 'name,location,categories,distance,tel,website,hours,rating,price,photos',
            sort: 'distance',
            limit: 25
        }
    };

    axios.get('https://api.foursquare.com/v3/places/search', reqConfig)
        .then((response) => {
            res.json(response.data);
        })
        .catch((err) => {
            res.send(err);
        });

});

app.listen(process.env.PORT, () => {
    console.log(`App Listening on port ${process.env.PORT}`);
});