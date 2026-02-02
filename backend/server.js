import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(cookieParser())
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);
app.use('/api/user', userRoutes)
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