const express = require('express');  
const bodyparser = require('body-parser');
require('dotenv').config();
const db = require("./db");

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const userRoutes = require('./routes/userRoute');
const candidateRoutes = require('./routes/candidateRoute');

app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);


app.listen(PORT, () => {
  console.log("Server running on port 3000");
});


