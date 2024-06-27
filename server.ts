import app from './src/home/startup'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 6161



   console.log(`Database connection established`)
   app.listen(PORT, ()=>{
    console.log(`Server connected and listening on port ${PORT}`)
   })
   








