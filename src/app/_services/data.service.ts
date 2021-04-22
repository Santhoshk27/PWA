import { Injectable } from '@angular/core';
import {SettingsService} from './settings.service';
import {BehaviorSubject} from 'rxjs';
import {ApitubeService} from './apitube.service';
import {Data} from '../_models/data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSource  = new BehaviorSubject(this.getData());
  public currentData = this.dataSource.asObservable();

  public httpDataSubscriber: any;

  constructor(
    public config: SettingsService,
    private apiTube: ApitubeService
  ) {  }


  // ToDo: not sure it is a correct way to get data in the app
  getData(): Data | undefined {
    let data: Data | undefined;

    if (this.config.haveCatalogAccess()) {
      this.httpDataSubscriber = this.apiTube.getWholeData()
        .subscribe(
          (d: Data) => {
            data = d;
            this.changeData(data);
          },
          error => {
            console.log(error);
          },
        )
      ;
    }
    return data;
  }

  changeData(data: Data | undefined): void {
    if (data !== undefined) {
      this.dataSource.next(data);
      this.config.setParametersFromServer(data.Settings);
    }
  }

  ngOnDestroy(): void {
    this.httpDataSubscriber.unsubscribe();
  }

}
