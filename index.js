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
    const { lat, lon, location } = req.query;
    let fourSquareReqConfig = {
        method: 'get',
        headers: {
            Accept: 'application.json',
            Authorization: process.env.FOURSQUARE_API_KEY
        },
        params: {
            ll: `${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`,
            radius: '16094',
            categories: '13065',
            fields: 'name,location,categories,distance,tel,website,hours,rating,price,photos',
            sort: 'distance',
            limit: 25
        }
    };
    const mapboxReqConfig = {
        method: 'get',
        headers: {
            Accept: 'application.json'
        },
        params: {
            limit: 1,
            types: 'place,postcode,address,poi',
            access_token: process.env.MAPBOX_TOKEN
        }
    };
    let latitude;
    let longitude;

    if (location) {
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`, mapboxReqConfig)
            .then((resp) => {
                longitude = resp.data.features[0].center[0];
                latitude = resp.data.features[0].center[1];
                fourSquareReqConfig.params.ll = `${latitude},${longitude}`;
                console.log(`${latitude},${longitude}`);
                axios.get('https://api.foursquare.com/v3/places/search', fourSquareReqConfig)
                    .then((response) => {
                        res.json(response.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }).catch((err) => {
                console.log(err);
            });
    } else {
        axios.get('https://api.foursquare.com/v3/places/search', fourSquareReqConfig)
            .then((response) => {
                res.json(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };



});

app.listen(process.env.PORT, () => {
    console.log(`App Listening on port ${process.env.PORT}`);
});