import {Component, OnInit} from '@angular/core';
import {Data} from '../../_models/data';
import {DataService} from '../../_services/data.service';
import {Item} from '../../_models/item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})

export class ItemsComponent implements OnInit {

  showItem: any;

  public currentData: Data | undefined;
  public dataSubscriber: any;

  constructor(public data: DataService) {
    this.entityInitialization();
  }

  entityInitialization(): void {
    this.dataSubscriber = this.data.currentData.subscribe(data => this.currentData = data);
  }

  ngOnInit(): void {
    this.entityInitialization();

    if (this.currentData !== undefined) {
      this.showItem = this.getModItemsListForTemplate(this.currentData.Items);
    }

  }


  // ToDo: the function is a case a bit slowly showing catalog up.
  // maybe need to shift that to content component
  // or maybe will be better to shift it to the API-server logic
  getModItemsListForTemplate(items: Item[]): any {
    // debugger;

    const itemsByCategories: Array<{ Id: number; Name: string; Items: Item[]; }> = [];
    // return itemsByCategories;

    if (items !== undefined && items.length !== 0) {

      let catItems: Array<Item> = [];
      let classIdBuf = items[0].classId;

      // for showing the group title in the template
      items.forEach((item) => {

        // combine the items to the groups.
        if (item.classId === classIdBuf ) {
          catItems.push(item);

        } else {
          classIdBuf = item.classId;

          itemsByCategories.push( {Id: catItems[0].classId, Name: catItems[0].className, Items: catItems} );
          catItems = [];
          catItems.push(item);
        }
        return itemsByCategories;
      });
    }

    return itemsByCategories;
  }

  ngOnDestroy(): void {
    this.dataSubscriber.unsubscribe();
  }

}
