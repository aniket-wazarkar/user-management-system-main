// app.js

const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const userRoutes = require('./routes/userRoutes');
const Joi = require('joi');
const app = express();
const PORT = process.env.PORT || 3000;
const Redis_Port = 6379;

// Connect to MongoDB
// mongoose.connect('mongodb+srv://aniketwazarkar5:password@987@usermanagement.oxautsk.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://root:root@usermanagement.oxautsk.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Connect to Redis
// const client = redis.createClient();
// client.on('connect', () => {
//   console.log('Connected to Redis');
// });

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
