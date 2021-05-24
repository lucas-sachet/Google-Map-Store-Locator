const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const Store = require('./models/store')
require('dotenv').config();

const app = express()
const port = 3000


mongoose.connect(process.env.CONNECT_MONGOOSE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*")
  next();
})
app.use(express.json({ limit: '50mb' }));

app.post('/api/stores', (req,res) => {
  let dbStores = [];
  let stores = req.body;
  stores.forEach((store) => {
    dbStores.push({
      storeName: store.name,
      phoneNumber: store.phoneNumber,
      address: store.address,
      openStatusText: store.openStatusText,
      addressLines: store.addressLines,
      location: {
        type: 'Point',
        coordinates: [
          store.coordinates.longitude,
          store.coordinates.latitude
        ]
      }
    })
  }) 

  Store.create(dbStores, (err, stores) =>{
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(stores);
    }
  })
} )

app.get('/api/stores', (req, res) => {
  const zipCode = req.query.zip_code;

  const googleMapsURL = "https://maps.googleapis.com/maps/api/geocode/json"
  axios.get(googleMapsURL, {
    params: {
      address: zipCode,
      key: process.env.GOOGLE_API_KEY
    }
  }).then((response) => {
    const data = response.data;
    const coordinates = [
      data.results[0].geometry.location.lng,
      data.results[0].geometry.location.lat,
    ]

    Store.find({
      location: {
        $near: {
          $maxDistance: 3218,
          $geometry: {
            type: "Point",
            coordinates: coordinates
          }
        }
      }
    }, (err, stores) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(stores);
      }
    })

  }).catch((error) => {
    console.log(error);
  })
})

app.delete('/api/stores', (req, res) => {
  Store.deleteMany({}, (err) => {
    res.status(200).send(err);
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})