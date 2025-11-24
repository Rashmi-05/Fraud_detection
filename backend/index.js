import express from "express";
import { pool } from './db.js'; // note the `.js` extension is required in ES6 modules
import dotenv from 'dotenv';
import sequelize from "./Models/index.js";
import userRoutes from './Routes/userRoutes.js';
import cookieParser from "cookie-parser";



dotenv.config();


const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin:[
//     "http://localhost:5173", 
//     "https://049d98f2fca2.ngrok-free.app",
//       " https://87cde77f0707.ngrok-free.app"// your local vite de      // allow any ngrok tunnel
//   ],
    
//   methods: "GET,POST,PUT,DELETE",
//   credentials:true,
// }));

//Routes
app.use('/', userRoutes);
//app.use('/provider', providerRoutes);
// app.use('/admin',adminController)
// app.use('/verify',verify)
// Sample route to test NeonDB connection
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM temp');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Start the server

// const sslOptions = {
//   key: fs.readFileSync("../certs/key.pem"),
//   cert: fs.readFileSync("../certs/cert.pem")
// };

const PORT = 5000; // or your desired port

// https.createServer(sslOptions, app).listen(PORT, async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     console.log(`✅ HTTPS Server is running on https://172.20.10.3:${PORT}`);
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// });

app.listen(PORT, "0.0.0.0", async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});