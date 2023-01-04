import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'

import api from './routes/api.routes.js';
import Pangolin from './models/Pangolin.js';
import Friend from './models/Friend.js';

dotenv.config()

mongoose.set('strictQuery', false);
const mongoURI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_ADDRESS}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;

const dbconnect = mongoose
    .connect(mongoURI)
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`); //LOG
        Pangolin.createCollection();
        Friend.createCollection();
    })
    .catch((err) => {
        console.log('URI: ' + mongoURI); //LOG
        console.error('Error connecting to mongo', err.reason); //LOG
    });

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);
app.use(cors());

app.use('/api', api);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log('Connected to port ' + port); //LOG
});

app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    })
});

app.use(function (err, req, res, next) {
    console.error(err.message); //LOG
    
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});