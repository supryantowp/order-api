import { OrderStatus } from './OrderStatus';

export default interface Order {
  id: Number;
  userId: Number;
  quantity: Number;
  shipDate: Date;
  status: OrderStatus;
  complete: Boolean;
}
