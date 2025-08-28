const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoUrl);


const db = mongoose.connection;

db.on('connected',()=>{
  console.log("connected");
})

db.on('error',(err)=>{
  console.log("mongodb connection error:",err);
})

db.on('disconnected',()=>{
  console.log("disconnected");
})

module.exports = db;