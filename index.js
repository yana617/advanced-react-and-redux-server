const express = require('express');
const http = require('http');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const app = express();

app.use(passport.initialize());
require('./services/passport');

app.use(cors())

const router = require('./router');

mongoose.connect('mongodb://localhost:27017/auth');

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

router(app);

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);