import {Component, OnInit, Input} from '@angular/core';
import {Item} from '../../../_models/item';
import {Order} from '../../../_models/order';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {OrderService} from '../../../_services/order.service';
import {OrderItem} from '../../../_models/orderitem';
import {SettingsService} from '../../../_services/settings.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DataService} from '../../../_services/data.service';
import {Data} from '../../../_models/data';
import {Settings} from '../../../_models/settings';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  animations: [
    trigger('addItemToCart', [
        state('void', style({opacity: 0})),
        state('inCart',
          style({
          }), {
           params: { xVal: 0, yVal: 0 }
          }
        ),
        transition(
          '* => inCart, void => inCart', [
            animate(800,  // 0.3s 500ms ease-in
              keyframes([
                style({ offset: 0.84, zIndex: 1050, transform: 'translate({{xVal}}px, {{yVal}}px) scale(0.35, 0.35)', opacity: 0.3}),
                style({ offset: 0.85, zIndex: 1050, transform: 'translate(0, 0) scale(1)', opacity: 0.3 }),
                style({ offset: 1,  opacity: 1}),
              ])
            ),
          ]
        )
    ])
  ]
})

export class ItemComponent implements OnInit {

  @Input() public prod: Item | any;
  @Input() public i = 0;


  public inputQty = 0;
  public showQtyControl = true;

  public itemId = 0;

  state = 'inList';
  positionCartX = 100;
  positionCartY = 40;
  shiftToX = 0;
  shiftToY = 0;

  public currentOrder: Order | undefined;
  public orderSubscriber: any;

  public currentData: Data | undefined;
  public dataSubscriber: any;

  public currentSettings: Settings | undefined;
  public settingsSubscriber: any;

  constructor(
    public config: SettingsService,
    private sanitizer: DomSanitizer,
    public orderService: OrderService,
    public data: DataService
  ) {
    this.entityInitialization();
  }

  entityInitialization(): void {
    this.orderSubscriber = this.orderService.currentOrder.subscribe(order => this.currentOrder = order);
    this.dataSubscriber = this.data.currentData.subscribe(data => this.currentData = data);
    this.settingsSubscriber = this.config.currentSettings.subscribe(settings => this.currentSettings = settings);
  }

  ngOnInit(): void {
    this.entityInitialization();

    this.itemId = this.prod.Id;

    if (this.currentSettings?.showOrder) {
      this.itemId = this.prod.saleItemId;
    }

    // setting the add button, fields to change ammount or the description
    // check if item in the cart (order)
    if (this.currentOrder !== undefined && this.currentOrder.Items !== undefined) {
      let orderItem: any;

      if (this.currentSettings?.showOrder) {
        this.inputQty = this.currentOrder.Items[this.i].Qty;

        if (this.currentOrder.Items[this.i].status > this.orderService.STATUS_ITEM_VOID) {
          this.showQtyControl = false;
        }

      } else {
        orderItem = this.currentOrder.Items
          .filter((x: OrderItem) => (x.saleItemId === this.itemId && x.status === this.orderService.STATUS_ITEM_VOID))
        ;
        if (orderItem[0] !== undefined) {
          this.inputQty = orderItem[0].Qty;
        }
      }

    }
  }


  // parameters for each item's CSS to make the visual effect of shifting to the cart
  get slideFromList(): any {
    return {
      value: this.state,
      params: {
        xVal: this.shiftToX,
        yVal: this.shiftToY
      }
    };
  }

  // increase amount of items in the cart
  plus(shiftEffect: boolean = false): void {

    if (shiftEffect) {
      const cartDomEl = document.getElementById('shoppingCart');
      const itemDomEl = document.getElementById('item_' + this.itemId);

      if (cartDomEl !== null && itemDomEl !== null) {
        const rectCart = cartDomEl.getBoundingClientRect();
        const rectItem = itemDomEl.getBoundingClientRect();

        this.positionCartX = rectCart.x;
        this.positionCartY = rectCart.y;

        this.shiftToX = this.positionCartX - rectItem.x;
        this.shiftToY = this.positionCartY - rectItem.y;
      }
      this.state = 'inCart';
    }

    this.inputQty = this.inputQty + 1;

    this.orderService.updateItemInOrder(this.currentOrder, this.prod, this.itemId, this.inputQty);
  }

  // decrease amount of items in the cart
  minus(): void {
    if (this.inputQty > 0) {
      this.inputQty = this.inputQty - 1;
    }
    if (this.inputQty === 0) {
      this.state = 'inList';
    }
    this.orderService.updateItemInOrder(this.currentOrder, this.prod, this.itemId, this.inputQty);
  }

  // getting the iamage for the item, if it is available
  ngGetImgSrc(): any {

    let thumb64 = '';

    // if the product have the picture.
    if (this.prod.Thumb !== undefined && this.prod.Thumb !== '') {
      thumb64 = this.prod.Thumb;
    }

    // if it is a cart's interface - checking the picture in the items' list.
    if (this.prod.Thumb === undefined && this.currentData !== undefined && this.currentData.Items !== undefined) {
      const catalogItem = this.currentData.Items.filter( (x: Item) => x.Id === this.itemId)[0];
      if (catalogItem !== undefined && catalogItem.Thumb !== undefined) {
        thumb64 = catalogItem.Thumb;
      }
    }

    if (thumb64 !== '') {
      // ToDo: in our example we are using the png type of image,
      //  but for the general cases we should check the type before implement base64 decode.
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + thumb64);
    }

    return this.config.settings.defImgPath + this.config.settings.defImgFileName;
  }


  ngOnDestroy(): void {
    this.orderSubscriber.unsubscribe();
    this.dataSubscriber.unsubscribe();
    this.settingsSubscriber.unsubscribe();
  }

}
