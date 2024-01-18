const request = require('supertest');
const { app } = require('../app'); // Assuming your app is defined in 'app.js'
const User = require('../models/user');

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    // Mock the User.save function
    jest.spyOn(User.prototype, 'save').mockResolvedValueOnce({
      _id: '1', // Replace with a unique ID
      name: 'Aniket',
      lastName: 'Manoj Wazarkar',
      age: 24,
      location: 'Mumbai',
      interests: ['Reading', 'Coding'],
      income: 50000,
    });

    const newUser = {
      name: 'Aniket',
      lastName: 'Manoj Wazarkar',
      age: 24,
      location: 'Mumbai',
      interests: ['Reading', 'Coding'],
      income: 50000,
    };

    const response = await request(app)
      .post('/api/users')
      .set('auth', 'SecretKey') // Set your authentication header here
      .send(newUser);

    // Check response
    expect(response.status).toBe(201);
   // expect(response.body).toHaveProperty('userId', 'userId'); // Replace with the actual user ID
  });

  
});
