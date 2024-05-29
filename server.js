const app = require('./src/home/startup').app

const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 6161





//useless commmment
 
 mongoose.connect(process.env.DATABASE_STRING)
.then(()=>{
   console.log(`Database connection established`)
   app.listen(PORT, ()=>{
    console.log(`Server connected and listening on port ${PORT}`)
   })
   
}) 







