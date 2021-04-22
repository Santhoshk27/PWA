import { Component, OnInit } from '@angular/core';
import {Order} from '../../_models/order';
import {SettingsService} from '../../_services/settings.service';
import {OrderItem} from '../../_models/orderitem';
import {OrderService} from '../../_services/order.service';
import {Settings} from '../../_models/settings';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit {

  public currentOrder: Order | undefined;
  public orderSubscriber: any;

  public currentSettings: Settings | undefined;
  public settingsSubscriber: any;

  constructor(
    public config: SettingsService,
    public orderService: OrderService,
  ) {
    this.entityInitialization();
  }

  entityInitialization(): void {
    this.orderSubscriber = this.orderService.currentOrder.subscribe(order => this.currentOrder = order);
    this.settingsSubscriber = this.config.currentSettings.subscribe(settings => this.currentSettings = settings);
  }

  ngOnInit(): void {
    // this.entityInitialization();
  }

  ngCountOrderPrice(Items: Array<OrderItem>): number  {
    return this.orderService.ngCountOrderPrice(Items);
  }

  showOrder(): void {
    if (this.currentSettings !== undefined && !this.currentSettings.showOrder) {
      this.currentSettings.showCatalog = !this.currentSettings.showCatalog;
      this.currentSettings.showOrder = !this.currentSettings.showOrder;
    }
  }

  ngOnDestroy(): void {
    this.orderSubscriber.unsubscribe();
    this.settingsSubscriber.unsubscribe();
  }

}

