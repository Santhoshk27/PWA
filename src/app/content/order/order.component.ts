import {Component, OnInit} from '@angular/core';
import {Order} from '../../_models/order';
import {OrderService} from '../../_services/order.service';
import {OrderItem} from '../../_models/orderitem';
import {DataService} from '../../_services/data.service';
import {Catalog} from '../../_models/catalog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public currentOrder: Order | undefined;
  public orderSubscriber: any;

  public currentData: Catalog | undefined;
  public dataSubscriber: any;

  constructor(
    public orderService: OrderService,
    public data: DataService
  ) {
    this.entityInitialization();
  }

  entityInitialization(): void {
    this.orderSubscriber = this.orderService.currentOrder.subscribe(order => this.currentOrder = order);
    this.dataSubscriber = this.data.currentData.subscribe(data => this.currentData = data);
  }

  ngOnInit(): void {
    this.entityInitialization();
  }

  ngPriceItemAmount(item: OrderItem): number {
    if (item.Qty !== undefined) {
      return (item.Price * item.Qty);
    }
    return 0;
  }

  ngCountOrderPrice(Items: Array<OrderItem>): number  {
    return this.orderService.ngCountOrderPrice(Items);
  }

  ngConfirmOrder(): void {
    this.orderService.confirmOrder(this.currentOrder);
  }

  ngOnDestroy(): void {
    this.orderSubscriber.unsubscribe();
  }

}
