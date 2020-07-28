import { OrderStatus } from './OrderStatus';

export default interface Order {
  id: Number;
  userId: Number;
  quatity: Number;
  shipDate: Date;
  status: OrderStatus;
  complete: Boolean;
}
