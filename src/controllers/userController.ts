import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';

let users: Array<User> = [];

export let getUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  const user = users.find(obj => obj.username === username);
  const httpStatusCode = user ? 200 : 404;
  return res.status(httpStatusCode).send(user);
};

export let addUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, firstname, lastname, email, password, phone } = req.body;

  const user: User = {
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
  return res.status(201).send(user);
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
  return res.status(204).send();
};

export let removeUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  const user = users.findIndex(obj => obj.username === username);

  if (user === -1) {
    return res.status(404).send();
  }

  users = users.filter(item => item.username !== username);
  return res.status(204).send();
};
