import {Component, OnInit} from '@angular/core';
import {SettingsService} from './_services/settings.service';
import {DataService} from './_services/data.service';
import {Data} from './_models/data';
import {Settings} from './_models/settings';
import {OrderService} from './_services/order.service';
import {Order} from './_models/order';
import {ApitubeService} from './_services/apitube.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = this.config.settings.title;

  public currentData: Data | undefined;
  public dataSubscriber: any;

  public currentSettings: Settings | undefined;
  public settingsSubscriber: any;

  public currentOrder: Order | undefined;
  public orderSubscriber: any;

  constructor(
    public config: SettingsService,
    public data: DataService,
    public orderService: OrderService,
    private apiTube: ApitubeService,
  ) {
    // this.entityInitialization();
  }

  entityInitialization(): void {
    this.dataSubscriber = this.data.currentData.subscribe(data => this.currentData = data);
    this.settingsSubscriber = this.config.currentSettings.subscribe(settings => {
      this.currentSettings = settings;
      // console.log(this.currentSettings);
    });
    this.orderSubscriber = this.orderService.currentOrder.subscribe(order => this.currentOrder = order);
  }


  ngOnInit(): void {
    this.entityInitialization();
    if (this.currentSettings !== undefined) {
      this.title = this.currentSettings.title;
    }
  }


  ngOnDestroy(): void {
    this.dataSubscriber.unsubscribe();
    this.settingsSubscriber.unsubscribe();
    this.orderSubscriber.unsubscribe();
  }



  // For test purposes

  testGetOpenOrder(): any {

    if (this.currentSettings !== undefined) {
      // alert (this.currentSettings.currentOrderId);
      // this.currentSettings.currentOrderId = 1210;

      // this.config.setParametersFromServer(this.currentSettings);
      // this.orderService.changeOrder(this.orderService.getOrder());

      // alert (this.currentSettings.currentOrderId);

    }

  }

  testChangeOrderParam(statusID: number): any {
    const order = this.currentOrder;
    if (order !== undefined) {
      order.status = statusID;
      // return this.orderService.changeOrderStatus(order);

      return this.apiTube.changeOrderInfo(order.Id, order).subscribe(
        (orderBack: Order) => {
          console.log('changeOrderStatus', orderBack.Id, orderBack.status);
          this.orderService.changeOrder(orderBack);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
    return null;
  }


  testClearOrder(): void {
    const nameDevice = this.currentSettings?.codeDevice;
    if (nameDevice !== undefined) {
      this.apiTube.releaseOrderFromDevice(nameDevice).subscribe(
        (res: boolean) => {
          if (res) {
            this.orderService.clearCart();
            this.orderService.changeOrder(this.orderService.getOrder());
          }
        }
      );
    }
  }


}

