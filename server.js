import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/connectDB.js';
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Department Feedback System is running.');
});

const startServer = async() => {
    try {
        app.listen(PORT, async () => {
            await connectDB();
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server: ", error);
    }
}

startServer();