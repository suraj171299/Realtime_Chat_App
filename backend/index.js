import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoute from './routes/userRoutes.js';
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000;

//routes
app.use('/api/v1/user', userRoute)


app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at PORT ${PORT}`);
});

