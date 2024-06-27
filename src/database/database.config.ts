import {Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const port = Number(process.env.POSTGRES_PORT) 
const password = process.env.POSTGRES_PASSWORD || "DEFALULT"
const pool = new Pool({
    user: "postgres",
    host: 'localhost',
    database: "anon_stream_db",
    password: "genders1703",
    port: port || undefined,
})

export default pool