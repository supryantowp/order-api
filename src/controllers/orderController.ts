import { NextFunction, Request, Response } from 'express';
import * as halson from 'halson';
import * as _ from 'lodash';
import { ApplicationType } from '../models/applicationType';
import Order from '../models/order';
import { OrderStatus } from '../models/orderStatus';
import { formatOutput } from '../utility/orderApiUtility';

const APPLICATION_JSON: string = 'application/json';
let orders: Array<Order> = [];

export let getOrder = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  let order = orders.find(obj => obj.id === Number(id));
  const httpStatusCode = order ? 200 : 404;

  if (order) {
    order = halson(order).addLink('self', `/store/orders/${order.id}`);
  }

  return formatOutput(res, order, httpStatusCode, 'order');
};

export let getAllOrders = (req: Request, res: Response, next: NextFunction) => {
  const limit = req.query.limit || orders.length;
  const offset = req.query.offset || 0;
  const filteredOrders = _(orders)
    .drop(offset)
    .take(limit)
    .value();
  filteredOrders.map(order => {
    return halson(order)
      .addLink('self', `/store/orders/${order.id}`)
      .addLink('user', {
        href: `/users/${order.userId}`,
      });
  });

  return formatOutput(res, filteredOrders, 200, 'order');
};

export let addOrder = (req: Request, res: Response, next: NextFunction) => {
  const { userId, quantity, shipDate } = req.body;
  let order: Order = {
    id: Math.floor(Math.random() * 100) + 1,
    userId: userId,
    quantity: quantity,
    shipDate: shipDate,
    status: OrderStatus.Placed,
    complete: false,
  };
  orders.push(order);
  order = halson(order)
    .addLink('self', `/store/orders/${order.id}`)
    .addLink('user', {
      href: `/users/${order.userId}`,
    });

  return formatOutput(res, order, 201, 'order');
};

export let removeOrder = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const order = orders.findIndex(obj => obj.id === id);

  if (order === -1) {
    return res.status(404).send();
  }

  orders = orders.filter(item => item.id !== id);
  return formatOutput(res, {}, 204);
};

export let getInventory = (req: Request, res: Response, next: NextFunction) => {
  const status = req.query.status;
  let inventoryOrders = orders;
  if (status) {
    inventoryOrders = inventoryOrders.filter(item => item.status === status);
  }
  const grouppedOrders = _.groupBy(inventoryOrders, 'userId');
  return formatOutput(res, grouppedOrders, 200, 'inventory');
};
