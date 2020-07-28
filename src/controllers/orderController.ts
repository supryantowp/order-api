import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import { default as Order } from '../models/order';
import { OrderStatus } from '../models/orderStatus';

let orders: Array<Order> = [];

export let getOrder = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const order = orders.find(obj => obj.id === Number(id));
  const httpStatusCode = order ? 200 : 404;
  return res.status(httpStatusCode).send(order);
};

export let getAllOrders = (req: Request, res: Response, next: NextFunction) => {
  const limit = req.query.limit || orders.length;
  const offset = req.query.offset || 0;
  return res.status(200).send(
    _(orders)
      .drop(offset)
      .take(limit)
      .value()
  );
};

export let addOrder = (req: Request, res: Response, next: NextFunction) => {
  const { userId, quantity, shipDate } = req.body;
  const order: Order = {
    id: Math.floor(Math.random() * 100) + 1,
    userId: userId,
    quatity: quantity,
    shipDate: shipDate,
    status: OrderStatus.Placed,
    complete: false,
  };
  orders.push(order);
  return res.status(201).send(order);
};

export let removeOrder = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const order = orders.findIndex(obj => obj.id === id);

  if (order === -1) {
    return res.status(404).send();
  }

  orders = orders.filter(item => item.id !== id);
  return res.status(204).send();
};

export let getInventory = (req: Request, res: Response, next: NextFunction) => {
  const status = req.query.status;
  let inventoryOrders = orders;
  if (status) {
    inventoryOrders = inventoryOrders.filter(item => item.status === status);
  }
  const grouppedOrders = _.groupBy(inventoryOrders, 'userId');
  return res.status(200).send(grouppedOrders);
};
