'use strict';

require('@code-fellows/supergoose');
const superTest=require('supertest');
const server=require('../auth-server/src/server');
const bcrypt=require('bcrypt');
const base64=require('base-64');
const mockServer=superTest(server.app);

describe('AUTH Routes',()=>{
    it('POST /signup creates a new user and sends an object with the user and the token to the client',()=>{
        let obj={
            username:'sara',
            password:123,
            role:'editor',
        };
        let res = await mockServer.post('/signup').send(obj);
        expect(res.body.username).toEqual(obj.username);
        expect(res.body.token).toBeDefined();
        expect(res.status).toBe(201);

    })
    it('POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client',()=>{
        let obj={
            username:'sara',
            password:123,
            role:'editor',
        }
        const userRow='sara:123';
        const encode=base64.encode(userRow);
        let res = await mockServer.post('/signin').set({
            Authorization:`baseic ${encode}`
        });
        expect(res.body.user.username).toEqual(obj.username);
        expect(res.body.token).toEqual(obj.username);
        expect(res.status).toBe(200);

    })
})