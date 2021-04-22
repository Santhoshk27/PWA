import {OrderItem} from './orderitem';

export interface Order { // Interface
  Id: number;

  order_id: string;

  stationCode: string; // ??? should it be change each time with refresh?
  status: number;

  servedBy: number | undefined;
  shiftId?: number | undefined;  // ???  what is it?
  isLocked: number;

  // ??? check everything
  dataAdd: string;
  timeAdd: string;
  dataClose?: string;
  timeClose?: string;
  updateAt?: string;
  lastSyncAt?: string;

  aliasText?: string;
  remarks?: string;

  totalAmount?: number;
  totalPaid?: number;

  Items?: OrderItem[];
}

/*
export class Order implements OrderInterface {
  id = 0;

  stationCode = '';
  status = 1;

  servedBy = 1;
  shiftId = 1;
  isLocked = 0;

  dataAdd = new Date();
  timeAdd = new Date().getTime().toString();
  dataClose = new Date();
  timeClose = new Date().getTime().toString();
  updateAt = new Date();
  lastSyncAt = new Date();

  aliasText = '';
  remarks = '';

  totalAmount = 0;
  totalPaid = 0;

  Items: OrderItem[] = Array<OrderItem>();
}
*/

