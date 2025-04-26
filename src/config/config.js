import { Pool } from "pg";
import Dotenv from 'dotenv';
Dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

export default pool;
