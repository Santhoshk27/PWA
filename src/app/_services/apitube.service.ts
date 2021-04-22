import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

import {Catalog} from '../_models/catalog';
import {environment} from '../../environments/environment';
import {Settings} from '../_models/settings';
import {User} from '../_models/user';
import {Item} from '../_models/item';
import {Order} from '../_models/order';
import {Data} from '../_models/data';

@Injectable({
  providedIn: 'root'
})

export class ApitubeService {

  constructor(private http: HttpClient) {
    this.http.get(environment.API_ROOT + 'settings');
  }

  // getting the catalog's categories
  public getCategory(): any {
    return this.http.get(environment.API_ROOT + 'category');
  }

  // getting the catalog's items
  public getItems(): Observable<Item> {
    return this.http.get<any>(environment.API_ROOT + 'item');
  }

  // Getting the entire catalog from the server,
  // including the categories and items in one request.
  public getWholeCatalog(): Observable<Catalog> {
    // debugger;
    return this.http.get<Catalog>(environment.API_ROOT + 'catalog');
  }
  public getWholeData(): Observable<Data> {
    return this.http.get<Data>(environment.API_ROOT + 'data');
  }

  // resive the settings from the API server.
  public getSettings(): Observable<Settings> {
    return this.http.get<Settings>(environment.API_ROOT + 'settings'); // .map((res: Response) => res.json().response);
  }

  // authorisation on th API server.
  // as a result we receive User entity with token.
  public login(username: string, password: string): Observable<User> {
    // return this.http.post<any>(environment.API_ROOT + '/user', { username, password });
    return this.http.get<any>(environment.API_ROOT + 'user?name=' + username + '&pas=' + password + '');
  }

  // getting the order from API server by ID
  // id - id code of Order
  public getOrder(id: number = 0 ): Observable<Order> {
    // console.log(environment.API_ROOT + 'orders?id=' + id);
    return this.http.get<any>(environment.API_ROOT + 'orders?id=' + id);
  }

  // sending the order to the API server,
  public setOrder(currentOrder: Order): any {
    return this.http.post<any>(environment.API_ROOT + 'orders', currentOrder);
    // return currentOrder;
  }

  public changeOrderInfo(id: number, param: Order): any {
    if (id > 0) {
      return this.http.put<any>(environment.API_ROOT + 'orders?id=' + id, param);
    }
    // return error('no order Id');
  }

  // unlink the order from the device
  public releaseOrderFromDevice(nameDevice: string): any {
    return this.http.get<boolean>(environment.API_ROOT + 'Orders/releaseOrderFromDevice?nameDevice=' + nameDevice);
  }

  // create the mark in database: need waiter's attention
  public callWaiter(nameDevice: string): any {
    return this.http.get<boolean>(environment.API_ROOT + 'Settings/callWaiter?nameDevice=' + nameDevice);
  }

}



