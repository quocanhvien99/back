import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import mongoose from 'mongoose';
import manhuaRoute from './routes/manhua';
import genreRoute from './routes/genre';
import userRoute from './routes/user';
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI!);
const db = mongoose.connection;
db.once('open', () => {
	console.log('Mongodb connected');
});

const app = express();

app.locals.redisClient = new Redis();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/manhua', manhuaRoute);
app.use('/genre', genreRoute);
app.use('/user', userRoute);

app.listen(process.env.PORT || 3000, () => console.log('Server is running'));
