// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');
// const authMiddleware = require('../middlewares/authMiddleware');
// const validateUser = require('../middlewares/validate-user');
// const Joi = require('joi');
// const redisClient = require('../redisClient');
// const redis = require('redis');
// const mongoose = require('../models/user')

// // Creating User route {POST}
// router.post('/', authMiddleware, validateUser, async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();

//     // Save user data to Redis
//     redisClient.set(`user:${user.id}`, JSON.stringify(user));

//     return res.status(201).json({ userId: user.id });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Get All Users route
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     // Check if data is available in Redis
//     redisClient.keys('user:*', async (err, keys) => {
//       if (err) throw err;

//       if (keys.length > 0) {
//         // Fetch data from Redis
//         redisClient.mget(keys, (err, users) => {
//           if (err) throw err;

//           const parsedUsers = users.map((user) => JSON.parse(user));
//           return res.status(200).json(parsedUsers);
//         });
//       } else {
//         // If no data in Redis, fetch from MongoDB
//         const users = await User.find();
//         return res.status(200).json(users);
//       }
//     });
//   } catch (error) {
//     console.error('Error getting users:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Get User by ID route
// router.get('/:userId', authMiddleware, async (req, res) => {
//   try {
//     // Check if data is available in Redis
//     redisClient.get(`user:${req.params.userId}`, async (err, user) => {
//       if (err) throw err;

//       if (user) {
//         // Fetch data from Redis
//         return res.status(200).json(JSON.parse(user));
//       } else {
//         // If no data in Redis, fetch from MongoDB
//         const user = await User.findById(req.params.userId);
//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }
//         // Save user data to Redis for future use
//         redisClient.set(`user:${user.id}`, JSON.stringify(user));
//         return res.status(200).json(user);
//       }
//     });
//   } catch (error) {
//     console.error('Error getting user by ID:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Update User by ID route {PUT}
// router.put('/:userId', authMiddleware, validateUser, async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user data in Redis
//     redisClient.set(`user:${updatedUser.id}`, JSON.stringify(updatedUser));

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user by ID:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Delete User by ID route
// router.delete('/:userId', authMiddleware, async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.userId);
//     if (!deletedUser) {
//       return res.status(404).json({ message: 'User not found or maybe already deleted' });
//     }

//     // Remove user data from Redis
//     redisClient.del(`user:${deletedUser.id}`);

//     return res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user by ID:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// module.exports = router;



//----------------------------------------------------//


// // Create a Redis client
// const createRedisClient = () => {
//   const client = redis.createClient({
//     host: 'eu2-intense-roughy-31023.upstash.io',
//     port: 31023,
//     password: '9cd395bf1dea470694d91869de71be2b',
//     tls: { servername: 'eu2-intense-roughy-31023.upstash.io' },
//   });

//   client.on('connect', () => {
//     console.log('Connected to Upstash Redis');
//   });

//   return client;
// };

// // Create User route
// router.post('/', authMiddleware, validateUser, async (req, res) => {
//   const client = createRedisClient();

//   try {
//     const user = new User(req.body);
//     await user.save();

//     // Store user data in Upstash with an expiration time
//     client.setex(user.id.toString(), 3600, JSON.stringify(user), (err, reply) => {
//       if (err) {
//         console.error('Error storing user data in Upstash:', err);
//       } else {
//         console.log('User data stored in Upstash:', reply);
//       }

//       // Close the Upstash client after the operation
//       client.quit();
//     });

//     return res.status(201).json({ userId: user.id });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Get All Users route
// router.get('/', authMiddleware, async (req, res) => {
//   const client = createRedisClient();

//   try {
//     // Try to retrieve users from Upstash
//     client.keys('*', async (err, keys) => {
//       if (err) {
//         console.error('Error retrieving keys from Upstash:', err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }

//       if (keys.length > 0) {
//         // Users found in Upstash, retrieve data
//         const users = await Promise.all(keys.map(async (key) => {
//           return new Promise((resolve) => {
//             client.get(key, (error, userData) => {
//               if (error) {
//                 console.error('Error retrieving user data from Upstash:', error);
//                 resolve(null);
//               } else {
//                 resolve(JSON.parse(userData));
//               }
//             });
//           });
//         }));

//         // Close the Upstash client after the operation
//         client.quit();

//         return res.status(200).json(users.filter(user => user !== null));
//       } else {
//         // No users found in Upstash, fallback to MongoDB
//         const usersFromMongo = await User.find();

//         // Close the Upstash client after the operation
//         client.quit();

//         return res.status(200).json(usersFromMongo);
//       }
//     });
//   } catch (error) {
//     console.error('Error getting users:', error);
//     // Ensure the Upstash client is closed in case of an error
//     client.quit();
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Get User by ID route
// router.get('/:userId', authMiddleware, async (req, res) => {
//   const client = createRedisClient();

//   try {
//     // Try to retrieve a specific user from Upstash
//     client.get(req.params.userId, async (err, userData) => {
//       if (err) {
//         console.error('Error retrieving user data from Upstash:', err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }

//       if (userData) {
//         // User found in Upstash, return the data
//         const user = JSON.parse(userData);

//         // Close the Upstash client after the operation
//         client.quit();

//         return res.status(200).json(user);
//       } else {
//         // User not found in Upstash, fallback to MongoDB
//         const userFromMongo = await User.findById(req.params.userId);

//         // Close the Upstash client after the operation
//         client.quit();

//         if (!userFromMongo) {
//           return res.status(404).json({ message: 'User not found' });
//         }

//         return res.status(200).json(userFromMongo);
//       }
//     });
//   } catch (error) {
//     console.error('Error getting user by ID:', error);
//     // Ensure the Upstash client is closed in case of an error
//     client.quit();
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Update User by ID route
// router.put('/:userId', authMiddleware, validateUser, async (req, res) => {
//   const client = createRedisClient();

//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user data in Upstash with an expiration time (e.g., 1 hour)
//     client.setex(updatedUser.id.toString(), 3600, JSON.stringify(updatedUser), (err, reply) => {
//       if (err) {
//         console.error('Error updating user data in Upstash:', err);
//       } else {
//         console.log('User data updated in Upstash:', reply);
//       }

//       // Close the Upstash client after the operation
//       client.quit();
//     });

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user by ID:', error);
//     // Ensure the Upstash client is closed in case of an error
//     client.quit();
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Delete User by ID route
// router.delete('/:userId', authMiddleware, async (req, res) => {
//   const client = createRedisClient();

//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.userId);
//     if (!deletedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Delete user data from Upstash
//     client.del(deletedUser.id.toString(), (err, reply) => {
//       if (err) {
//         console.error('Error deleting user data from Upstash:', err);
//       } else {
//         console.log('User data deleted from Upstash:', reply);
//       }

//       // Close the Upstash client after the operation
//       client.quit();
//     });

//     return res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user by ID:', error);
//     // Ensure the Upstash client is closed in case of an error
//     client.quit();
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// module.exports = router;




//==================//

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const validateUser = require('../middlewares/validate-user') //
const Joi = require('joi');
const client = require('../redisClient');
const redis = require('redis');

// Creating User route {POST}
router.post('/', authMiddleware, validateUser, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // Save it in redis
    client.set(user.id, JSON.stringify(user));
    return res.status(201).json({ userId: user.id });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


//Get User by ID route
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    // Check if data is available in Redis
    client.get(`user:${req.params.userId}`, async (err, user) => {
      if (err) throw err;

      if (user) {
        // Fetch data from Redis
        return res.status(200).json(JSON.parse(user));
      } else {
        // If no data in Redis, fetch from MongoDB
        const user = await User.findById(req.params.userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Save user data to Redis for future use
        client.set(`user:${user.id}`, JSON.stringify(user));
        return res.status(200).json(user);
      }
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get all users
// router.get('/', authMiddleware, async (req, res) => {
//   const usersFromMongoDB = await User.find();
//   const mongoUsers=JSON.stringify(usersFromMongoDB);
//   client.set("allUsers",mongoUsers)
//   console.log(usersFromMongoDB);
//   return res.status(200).json(usersFromMongoDB);
  
  
// });
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Extract limit and offset from the query string, defaulting to 10 and 0 if not provided
    const limit = parseInt(req.query.limit) || 3;
    const offset = parseInt(req.query.offset) || 0;

    // Fetch users from MongoDB with limit and offset
    const usersFromMongoDB = await User.find().limit(limit).skip(offset);

    // Convert to JSON string and store in Redis
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
    // Update user data in MongoDB
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data in Redis
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
    // Delete user from MongoDB
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found or maybe already deleted' });
    }

    // Delete user from Redis
    client.del(req.params.userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = client;
module.exports = router;
