import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import app from '../../src/app';
import { User } from '../../src/models/User';

chai.use(chaiHttp);

const expect = chai.expect;

const user: User = {
  id: Math.floor(Math.random() * 100) + 1,
  username: 'John',
  firstname: 'John',
  lastname: 'Doe',
  email: 'jhon@gmail.com',
  phone: '455555',
  password: 'secret',
  userStatus: 1,
};

describe('userRoute', () => {
  it('should respond with http 404 status because there is no user', async () => {
    return await chai
      .request(app)
      .get(`/users/${user.username}`)
      .then(res => {
        expect(res.status).to.be.equal(404);
      });
  });

  it('should create a new user and retrieve it back', async () => {
    return chai
      .request(app)
      .post('/users')
      .send(user)
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.body.username).to.be.equal(user.username);
      });
  });

  it('should return the user created on the step before', async () => {
    return chai
      .request(app)
      .get(`/users/${user.username}`)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.username).to.be.equal(user.username);
      });
  });

  it('should update the user Jhon', async () => {
    user.username = 'Jhon Updated';
    user.firstname = 'Jhon Updated';
    user.lastname = 'Doe Updated';
    user.email = 'jhon_Updated@gmail.com';
    user.password = 'Password updated';
    user.phone = '12312';
    user.userStatus = 12;

    return chai
      .request(app)
      .patch(`/users/John`)
      .send(user)
      .then(res => {
        expect(res.status).to.be.equal(204);
      });
  });

  it('should return user update on the step before', async () => {
    return chai
      .request(app)
      .get(`/users/${user.username}`)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.username).to.be.equal(user.username);
        expect(res.body.firstname).to.be.equal(user.firstname);
        expect(res.body.lastname).to.be.equal(user.lastname);
        expect(res.body.email).to.be.equal(user.email);
        expect(res.body.password).to.be.equal(user.password);
        expect(res.body.phone).to.be.equal(user.phone);
        expect(res.body.userStatus).to.be.equal(user.userStatus);
      });
  });

  it('should return 404 because the user does not exist', async () => {
    user.firstname = 'Mary Jane';
    return chai
      .request(app)
      .patch(`/users/Mary`)
      .send(user)
      .then(res => {
        expect(res.status).to.be.equal(404);
      });
  });

  it('should remove an existent user', async () => {
    return chai
      .request(app)
      .del(`/users/${user.username}`)
      .then(res => {
        expect(res.status).to.be.equal(204);
      });
  });

  it('should return 404 when it is trying to remove an user because the user does not exist', async () => {
    return chai
      .request(app)
      .del(`/users/Mary`)
      .then(res => {
        expect(res.status).to.be.equal(404);
      });
  });
});
