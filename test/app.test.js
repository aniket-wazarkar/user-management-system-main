
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

                    "name": "Virat",

                    "lastName": "Kohli",

                    "age": 25,

                    "location": "Gurgaon",

                    "interests": ["Reading", "Gaming"],

                    "income": 500000

                })

                .set("auth", "SecretKey"); 

            console.log('Response Body:', response.body);

            console.log('Response Status:', response.status);
 
           

            expect(response.status).toBe(201);

           
 
        } catch (error) {


            console.error('Test error:', error);

            throw error; 
        }

    });

});
