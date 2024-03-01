var express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors());

// mongoose.connect(process.env.DB).then(()=>console.log("connected to database"));

module.exports = app;