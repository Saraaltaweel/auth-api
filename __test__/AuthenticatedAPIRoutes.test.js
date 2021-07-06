'use strict';

const supergoos = require('@code-fellows/supergoose');
const server=require('../auth-server/src/server');
const bcrypt=require('bcrypt');
const base64=require('base-64');
const mockServer=superTest(server.app);

let foodObj={
    name:'cake',
    calories:100,
    type:'FRUIT',
};

let userObj={
    username:'sara',
    password:123,
    role:'admin',

};

let id;
describe('V1 (Unauthenticated API) routes',()=>{
    it('POST /api/v1/:model , create permissions',async()=>{
        let signup = await mockServer.post('/signup').send(userObj);
        let signin = await mockServer.post('/signin').auth(userObj.username,userObj.password);
        let token = ` Bearer ${signin.body.token}`; 
        let admin = await mockServer.post('/api/v2/food').set('Authorization',token).send(foodObj)
        expect(admin.body.calories).toEqual(100);
        expect(admin.status).toEqual(201);
        id = admin.body._id
      });
    it('GET /api/v2/:model ,read permissions ',async()=>{
        let signin = await mockServer.post('/signin').auth(userObj.username,userObj.password);
        let token = ` Bearer ${signin.body.token}`; 
        let admin = await mockServer.get('/api/v2/food').set('Authorization',token);
        expect(admin.body[0].calories).toEqual(100);
        expect(admin.status).toEqual(200);
      });
    it('GET /api/v2/:model/ID , read permissions',async()=>{
        let signin = await mockServer.post('/signin').auth(userObj.username,userObj.password);
        let token = ` Bearer ${signin.body.token}`;
        let admin = await mockServer.get(`/api/v2/food/${id}`).set('Authorization',token);
       expect(admin.body.calories).toEqual(100);
        expect(admin.status).toEqual(200);
      });
    it('PUT /api/v2/:model/ID , update permissions',async()=>{
        let signin = await mockServer.post('/signin').auth(userObj.username,userObj.password);
        let token = ` Bearer ${signin.body.token}`;
        foodObj={
          name:'cake',
          calories:200,
          type:'FRUIT'
        }
        let admin = await mockServer.put(`/api/v2/food/${id}`).set('Authorization',token).send(foodObj);
        expect(admin.body.calories).toEqual(200);
        expect(admin.status).toEqual(200);
      });
    it('DELETE /api/v2/:model/ID , delete permissions',async()=>{
        let signin = await mockServer.post('/signin').auth(userObj.username,userObj.password);
        let token = ` Bearer ${signin.body.token}`;
        let admin = await mockServer.delete(`/api/v2/food/${id}`).set('Authorization',token);
        let check = await mockServer.get(`/api/v2/food/${id}`).set('Authorization',token);
        expect(check.body).toBeNull();
        expect(admin.status).toEqual(200);
      })
    });
