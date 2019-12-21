const mongoose = require('mongoose')
const resList = require('../models/resList')
const jsonList = require('../restaurant.json')
//connect mongodb
mongoose.connect('mongodb://localhost/resList', { useNewUrlParser: true, useUnifiedTopology: true })
//return 'connection' when connect mongodb
const db = mongoose.connection
//db status
db.on('error', () => {
  console.log('connect error')
})
db.once('open', () => {
  console.log('mongodb connected')

  //add data to 'resList' database
  for (let result in jsonList.results) {
    //console.log(jsonList.results[result].id)
    resList.create(
      {
        name: jsonList.results[result].name,
        name_en: jsonList.results[result].name_en,
        category: jsonList.results[result].category,
        image: jsonList.results[result].image,
        location: jsonList.results[result].location,
        phone: jsonList.results[result].phone,
        google_map: jsonList.results[result].google_map,
        rating: jsonList.results[result].rating,
        description: jsonList.results[result].description
      }
    )
  }
  console.log('seed done')


})
