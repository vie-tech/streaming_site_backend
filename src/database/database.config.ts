import {Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const port = Number(process.env.POSTGRES_PORT) 

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_SERVER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: port || undefined,
})

export default pool