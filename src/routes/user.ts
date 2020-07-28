import { Application } from 'express';
import * as userController from '../controllers/userController';

export class UserRoute {
  public routes(app: Application): void {
    app.route('/users/').post(userController.addUser);
    app.route('/users/:username').patch(userController.updateUser);
    app.route('/users/:username').delete(userController.removeUser);
    app.route('/users/:username').get(userController.getUser);
  }
}
