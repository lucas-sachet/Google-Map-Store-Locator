const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const Store = require('./models/store')


mongoose.connect('mongodb+srv://lucassachet:T62anmRtpPZx8r2@cluster0.ofbqy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json({ limit: '50mb' }));

app.post('/api/stores', (req,res) => {
  let dbStores = [];
  let stores = req.body;
  stores.forEach((store) => {
    dbStores.push({
      storeName: store.name,
      phoneNumber: store.phoneNumber,
      adress: store.adress,
      openStatusText: store.openStatusText,
      adressLines: store.adressLines,
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
  Store.find({}, (err, stores) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(stores);
    }
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