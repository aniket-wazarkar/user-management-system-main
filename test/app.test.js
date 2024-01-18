const request = require('supertest');
const app = require('../app'); 

describe('User Management API', () => {
  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const user = {
        name: 'John Doe',
        lastName: 'Doe',
        age: 25,
        location: 'City',
        interests: ['Coding', 'Reading'],
        income: 50000,
      };

      const res = await request(app).post('/users').send(user);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('userId');
    });
  });

  describe('GET /users/:userId', () => {
    it('should get a specific user by ID', async () => {
      const userId = '65a7b5c39bb5b3fb2d5051e0'; 
      const res = await request(app).get(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update a specific user by ID', async () => {
      const userId = '65a7b5c39bb5b3fb2d5051e0'; 
      const updatedUser = {
        name: 'Updated Name',
        
      };

      const res = await request(app).put(`/users/${userId}`).send(updatedUser);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a specific user by ID', async () => {
      const userId = '65a7b5c39bb5b3fb2d5051e0'; 
      const res = await request(app).delete(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'User deleted successfully');
    });
  });
});
