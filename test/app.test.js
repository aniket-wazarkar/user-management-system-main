
const request = require('supertest');
const client = require('../redisClient');
const mongoose = require("mongoose");
const user = require('../models/user')
const app = require('../app');
 
describe("POST /users", () => {

    it('should return 200 when user is added', async () => {

        try {

            const response = await request(app)

                .post("/api/users")

                .send({

                    "name": "John",

                    "lastName": "hello",

                    "age": 25,

                    "location": "Cityville",

                    "interests": ["Reading", "Gaming"],

                    "income": 50000

                })

                .set("auth", "SecretKey"); // Ensure the header key is "auth" instead of "AUTH_KEY"
 
            // Log the response details for debugging

            console.log('Response Body:', response.body);

            console.log('Response Status:', response.status);
 
            // Assertions

            expect(response.status).toBe(201);

            // Add more assertions based on your expectations for the response body
 
        } catch (error) {

            // Log any errors during the test

            console.error('Test error:', error);

            throw error; // Re-throw the error to fail the test

        }

    });

});
