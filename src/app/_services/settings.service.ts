import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from '../_models/settings';
import { ApitubeService } from './apitube.service';
import {User} from '../_models/user';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  private settingsSource  = new BehaviorSubject(this.getSettings());
  public currentSettings = this.settingsSource.asObservable();

  public settings = new Settings();

  constructor(
    private apiTube: ApitubeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  getSettings(): Settings {
    return new Settings();
  }

  public storeTokens(token: string): void {
    localStorage.setItem(this.settings.accessTokenName, token);
  }

  public getToken(): string {
    const cUser = this.getCurrentUser();
    return cUser.token;
  }

  public haveCatalogAccess(): boolean {
    if (this.getToken() !== '') {
      return true;
    }
    return false;
  }
  public haveOrderAccess(): boolean {
    if (this.getToken() !== '') {
      return true;
    }
    return false;
  }
  public showCatalog(): boolean {
    return this.settings.showCatalog;
  }
  public showOrder(): boolean {
    return this.settings.showOrder;
  }

  // ToDo: need to shift in User.service
  public storeCurrentUser(user: User): void {
    localStorage.setItem(this.settings.storageUserName, JSON.stringify(user));
    window.location.reload();
    this.router.navigate(['']);
  }
  public getCurrentUser(): User {
    const savedUser = localStorage.getItem(this.settings.storageUserName);
    if (savedUser === null) {
      return new User();
    }
    return JSON.parse(savedUser);
  }
  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem(this.settings.storageUserName);
    window.location.reload();
    this.router.navigate(['']);
  }

  // used only in the interceptors, probably redundant.
  setError(error: string): void {
    this.settings.errors.push(error);
  }
  getErrors(): any {
    if (this.settings.errors.length > 0) {
      return this.settings.errors;
    }
    return null;
  }
  clearErrors(): void {
    this.settings.errors = [];
  }


  setParametersFromServer(apiSettings: any): void {
    for (const key in apiSettings) {
      if (apiSettings.hasOwnProperty(key)) {
        if (this.settings.hasOwnProperty(key)) {
          const param: { [key: string]: any } = {};
          param[key] = apiSettings[key];
          Object.assign(this.settings, this.settings, param);
        }
      }
    }
    this.changeSettings(this.settings);
  }

  changeSettings(settings: Settings | undefined): void {
    if (settings !== undefined) {
      // console.log(settings);
      this.settingsSource.next(settings);
    }
  }


}
