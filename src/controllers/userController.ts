import { NextFunction, Request, Response } from 'express';
import * as halson from 'halson';
import { User } from '../models/User';
import { formatOutput } from '../utility/orderApiUtility';

let users: Array<User> = [];

export let getUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  let user = users.find(obj => obj.username === username);
  const httpStatusCode = user ? 200 : 404;
  if (user) {
    user = halson(user).addLink('self', `/users/${user.id}`);
  }
  return formatOutput(res, user, httpStatusCode, 'user');
};

export let addUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, firstname, lastname, email, password, phone } = req.body;

  let user: User = {
    id: Math.floor(Math.random() * 100) + 1,
    username: username,
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    phone: phone,
    userStatus: 1,
  };
  users.push(user);
  user = halson(user).addLink('self', `/users/${user.id}`);

  return formatOutput(res, user, 201, 'user');
};

export let updateUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  const userIndex = users.findIndex(item => item.username === username);

  if (userIndex === -1) {
    return res.status(404).send();
  }

  const user = users[userIndex];
  user.username = req.body.username || user.username;
  user.firstname = req.body.firstname || user.firstname;
  user.lastname = req.body.lastname || user.lastname;
  user.email = req.body.email || user.email;
  user.password = req.body.password || user.password;
  user.phone = req.body.phone || user.phone;
  user.userStatus = req.body.userStatus || user.userStatus;

  users[userIndex] = user;
  return formatOutput(res, {}, 204);
};

export let removeUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  const user = users.findIndex(obj => obj.username === username);

  if (user === -1) {
    return res.status(404).send();
  }

  users = users.filter(item => item.username !== username);
  return formatOutput(res, {}, 204);
};
