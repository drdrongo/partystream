import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import indexRouter from '@routes/index';
import usersRouter from '@routes/users';

// Load .env variables
dotenv.config();

const app = express();
const port = process.env.port ?? '8000';

app.use(cors()); // Enable CORS for all routes

// For specific url:
// const corsOptions = {
//   origin: 'http://localhost:5173',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// };
// app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use your routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
