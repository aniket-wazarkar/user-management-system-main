const request = require('supertest');
const assert = require('assert')
const { app } = require('../app');
const User = require('../models/user');

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    
    jest.spyOn(User.prototype, 'save').mockResolvedValueOnce({
      _id: '1', 
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
      .set('auth', 'SecretKey') 
      .send(newUser);

    
    expect(response.status).toBe(201);
   // expect(response.body).toHaveProperty('userId', 'userId');
  });

  
});

describe('GET /api/users', () => {
    it('should get all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('auth', 'SecretKey');
 
        assert.strictEqual(response.status, 200);
        assert.strictEqual(Array.isArray(response.body), true);
       
    });
 
    it('should return 401 if authentication fails', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('auth', 'invalid_key');
 
        assert.strictEqual(response.status, 401);
        
    });
 
});