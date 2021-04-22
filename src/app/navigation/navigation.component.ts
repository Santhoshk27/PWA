import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

import { SettingsService } from '../_services/settings.service';
import {Settings} from '../_models/settings';
import {Observable} from 'rxjs';
import {Category} from '../_models/category';
import {ApitubeService} from '../_services/apitube.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @Input() public showCategory: Observable<Category[]> | any;

  @ViewChild('callWaiter') callWaiter: ElementRef | undefined;

  // @ViewChild('stickyMenu') menuElement: ElementRef | undefined;

  public currentSettings: Settings | undefined;
  public settingsSubscriber: any;

  constructor(
    public config: SettingsService,
    private apiTube: ApitubeService,
  ) {
    // this.entityInitialization();
  }

  entityInitialization(): void {
    this.settingsSubscriber = this.config.currentSettings.subscribe(settings => this.currentSettings = settings);
  }

  ngOnInit(): void {
    this.entityInitialization();
  }

  ngAfterViewInit(): void {
    // console.log(this.currentSettings);
    if (this.currentSettings?.callWaiter === 1) {
      this.changeWaiterButton();
    }
  }


  ngCallWaiter(): void {
    const nameDevice = this.currentSettings?.codeDevice;
    if (nameDevice !== undefined) {
      this.apiTube.callWaiter(nameDevice).subscribe(
        (res: boolean) => {
          if (res) {
            this.config.settings.callWaiter = 1;
            this.config.changeSettings(this.config.settings);
            this.changeWaiterButton();
            // change the status of the button
            // btn-warning, we are coming
          }
        }
      );
    }

  }

  changeWaiterButton(): void {
    // console.log('this.callWaiter ', this.callWaiter );
    if (this.callWaiter !== undefined) {
      this.callWaiter.nativeElement.classList.add('btn-warning');
      this.callWaiter.nativeElement.classList.remove('btn-success');
    }
  }

  ngShowMenu(): void {
    if (this.currentSettings !== undefined && !this.currentSettings.showCatalog) {
      this.currentSettings.showCatalog = !this.currentSettings.showCatalog;
      this.currentSettings.showOrder = !this.currentSettings.showOrder;
    }

  }


  ngOnDestroy(): void {
    this.settingsSubscriber.unsubscribe();
  }


}
