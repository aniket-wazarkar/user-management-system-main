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
mongoose.connect('mongodb+srv://root:root@usermanagement.oxautsk.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use('/api/users', userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


module.exports = { app, server};