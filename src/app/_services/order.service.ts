import { Injectable } from '@angular/core';
import { Order } from '../_models/order';
import { Item } from '../_models/item';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from '../_models/orderitem';
import { SettingsService } from './settings.service';
import { ApitubeService } from './apitube.service';
import {DataService} from './data.service';
import {Data} from '../_models/data';
import {Settings} from '../_models/settings';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderSource  = new BehaviorSubject(this.getOrder());
  public currentOrder = this.orderSource.asObservable();

  public currentSettings: Settings | undefined;
  public settingsSubscriber: any;

  public STATUS_VOID       = 0;
  public STATUS_OPEN       = 1;
  public STATUS_PROCESSING = 2;
  public STATUS_CLOSED     = 3;
  public STATUS_REFUNDED   = 4;
  public STATUS_NAME       = [
    'Void', 'Open', 'Processing', 'Closed', 'Refunded'
  ];

  public STATUS_ITEM_VOID       = 0;
  public STATUS_ITEM_OPEN       = 1;
  public STATUS_ITEM_PROCESSING = 2;
  public STATUS_ITEM_CLOSED     = 3;
  public STATUS_ITEM_REFUNDED   = 4;

  constructor(
    private apiTube: ApitubeService,
    public config: SettingsService,
    public data: DataService
  ) {
    this.entityInitialization();
  }

  entityInitialization(): void {
    this.settingsSubscriber = this.config.currentSettings.subscribe(settings => {
      this.currentSettings = settings;

      // checking the link with the order
      // if the device contains another order - clear it up
      const currentOrderId = this.orderSource.getValue()?.Id;
      const settingsOrderId = this.currentSettings.currentOrderId;

      if (settingsOrderId !== undefined && settingsOrderId > 0 && currentOrderId !== settingsOrderId) {
        // upload order from server.
        this.apiTube.getOrder(settingsOrderId).subscribe(
          (order: Order) => {
            console.log('uploaded Order', order);
            this.changeOrder(order);
          },
          error => {
            console.log(error);
          },
        );

      }

    });
  }

  // retrieving the current order for the table
  // firstly try to get order from API-server
  // if not success - looking the cart information on the localstorage
  // if can't find any data - creating a new order instance to use it like a cart for our device.
  getOrder(): Order {
    let currentOrder = this.getEmptyOrder();
    const savedCart = localStorage.getItem(this.config.settings.storageCartName);
    if (savedCart !== null) {
      currentOrder = JSON.parse(savedCart);
    }
    this.changeOrder(currentOrder);
    return currentOrder;
  }

  // empty template for the cart
  getEmptyOrder(): Order {
   const ord: Order = {
    Id: 0,
    order_id: '',
    dataAdd: new Date().toDateString(),
    timeAdd: new Date().getTime().toString(),
    isLocked: 0,                      // ????
    servedBy: this.config.settings.waiterId, // do we need this? probably is enough the table marker and we can take waiterId on API server.
    stationCode: this.config.settings.codeDevice,
    status: this.STATUS_VOID,
    Items: [],
   };
   return ord;
  }


  // keep our cart in the local storage
  saveCart(order: Order): void {
    if (this.currentSettings !== undefined) {
      localStorage.setItem(this.currentSettings?.storageCartName, JSON.stringify(order));
    }
  }

  // remove cart in the local storage
  clearCart(): void {
    if (this.currentSettings !== undefined) {
      localStorage.removeItem(this.currentSettings?.storageCartName);
    }
  }


  // force to change order's data in the system
  changeOrder(order: Order): void {
    this.saveCart(order);
    if (this.orderSource !== undefined) {
      this.orderSource.next(order);
    }
  }


  // updating the list of items in the order.
  // if the item already exist in the order, update the qty of item in the order
  public updateItemInOrder(ord: Order | undefined, item: Item, itemId: number, qty: number = 0): void {

    if (ord !== undefined) {

      let existingItemIndex: number | undefined;
      let orderItems: Array<OrderItem> = [];

      if (ord.Items !== undefined) {
        orderItems = ord.Items;
        existingItemIndex = orderItems.findIndex(element => (element.saleItemId === itemId && element.status === this.STATUS_ITEM_VOID));
      }

      // if we can't find the item in the order - create new record in the order
      if (existingItemIndex === -1) {
        const newItem: OrderItem = {
          Id: '',
          orderId: ord.order_id,
          saleItemId: itemId,
          Name: item.Name,
          classId: item.classId,
          className: item.className,
          Code: item.Code,
          status: this.STATUS_ITEM_VOID,
          Price: item.Price,
          Qty: qty
        };
        orderItems.push(newItem);

      //
      } else {
        if (qty === 0) {
          if (typeof existingItemIndex === 'number') {
            orderItems.splice(existingItemIndex, 1);
          }
        } else {
          if (typeof existingItemIndex === 'number') {
            orderItems[existingItemIndex].Qty = qty;
          }
        }
      }


      ord.Items = orderItems;
      this.changeOrder(ord);
    }
  }

  public ngCountOrderPrice(Items: Array<OrderItem>): number {
    let totalPrice = 0;
    Items?.forEach( item => {
      if (item.Qty !== undefined){
        totalPrice += (item.Price * item.Qty);
      }
    });
    return totalPrice;
  }


  public confirmOrder(currentOrder: Order | undefined): void {

    if (currentOrder !== undefined && (currentOrder.status === this.STATUS_VOID || !this.isAllItemsInOrderConfirmed(currentOrder))) {

      // chanege status of order to confirm (OPEN)
      currentOrder.status = this.STATUS_OPEN;
      currentOrder.Items?.map(i => {
        if (i.status === this.STATUS_ITEM_VOID) {
          i.status = this.STATUS_ITEM_OPEN;
        }
      });

      console.log(currentOrder);

      // new order
      if (currentOrder.Id === 0 ) {
        this.apiTube.setOrder(currentOrder)
          .subscribe({
            next: (newOrder: Order) => {
              console.log('setOrder', newOrder);
              this.changeOrder(newOrder);
            },
            error: (error: any) => {
              console.error('There was an error!', error);
            }
          })
        ;

      // existing order
      } else if (currentOrder.Id > 0) {
        this.apiTube.changeOrderInfo(currentOrder.Id, currentOrder).subscribe(
          (changedOrder: Order) => {
            console.log('changeOrderInfo', changedOrder);
            this.changeOrder(changedOrder);
          },
          (error: any) => {
            console.log(error);
          }
        );
      }

    }

  }


  public getOrderStatus(statusId: number): string {
    return this.STATUS_NAME[statusId];
}

  // checking is it all items in the order have been confirmed?
  public isAllItemsInOrderConfirmed(order: Order): boolean {
    if (order.Items !== undefined) {
      const orderItem = order.Items.filter((x: OrderItem) => x.status === this.STATUS_ITEM_VOID);
      if (orderItem[0] !== undefined) {
        return false;
      }
    }
    return true;
  }


}




