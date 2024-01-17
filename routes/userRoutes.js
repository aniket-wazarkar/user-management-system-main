
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const validateUser = require('../middlewares/validate-user') //
const Joi = require('joi');
const client = require('../redisClient');
const redis = require('redis');
const mongoose = require('mongoose');

// Creating User route {POST}
router.post('/', authMiddleware, validateUser, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    client.set(user.id, JSON.stringify(user));
    return res.status(201).json({ userId: user.id });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get a user by ID
  router.get('/:userId', authMiddleware, async (req, res) => {
    const userId = req.params.userId;


    //Feature: if the object id enterd is in diffrent format or mistyped, return the error.
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }
    
    if (userId.length < 20) {
      return res.status(400).json({ message: 'Invalid userId length' });
    }

    try {
      const userFromMongoDB = await User.findById(userId);

      if (!userFromMongoDB) {
        return res.status(404).json({ message: 'User not found' });
      }

      const mongoUser = JSON.stringify(userFromMongoDB);
      client.set(`user:${userId}`, mongoUser);
      
      console.log(userFromMongoDB);
      return res.status(200).json(userFromMongoDB);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });



//Get all users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const offset = parseInt(req.query.offset) || 0;

    const usersFromMongoDB = await User.find().limit(limit).skip(offset);

    const mongoUsers = JSON.stringify(usersFromMongoDB);
    client.set("allUsers", mongoUsers);

    console.log(usersFromMongoDB);
    return res.status(200).json(usersFromMongoDB);
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



//Update user by ID Route
router.put('/:userId', authMiddleware, validateUser, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    client.set(req.params.userId, JSON.stringify(updatedUser));

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Delete User by ID Route
router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found or maybe already deleted' });
    }

    client.del(req.params.userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;












































//get all users
// router.get('/', authMiddleware, async (req, res) => {
//   const usersFromMongoDB = await User.find();
//   const mongoUsers=JSON.stringify(usersFromMongoDB);
//   client.set("allUsers",mongoUsers)
//   console.log(usersFromMongoDB);
//   return res.status(200).json(usersFromMongoDB);
  
  
// });
