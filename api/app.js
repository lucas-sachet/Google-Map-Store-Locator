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
  let dbStores = req.body; 
  console.log(dbStores);
  var store = new Store({
    storeName: "Test",
    phoneNumber: "99231365",
    location: {
      type: 'Point',
      coordinates: [
        -118.363715,
        34.057968
      ]
    }
  })
  store.save()
  res.send("you have posted")
} )

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})