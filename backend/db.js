// db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';
import User from './Models/user.js';
import sequelize from './Models/index.js';

dotenv.config();

const userModel = User(sequelize);




const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // for NeonDB0
  },
});

export  {pool, userModel}
