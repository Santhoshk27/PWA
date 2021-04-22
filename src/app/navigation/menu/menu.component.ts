import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../_models/category';

import { ViewportScroller } from '@angular/common';
import {Settings} from '../../_models/settings';
import {SettingsService} from '../../_services/settings.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  @Input() public showCategory: Observable<Category[]> | any;

  public currentSettings: Settings | undefined;
  public settingsSubscriber: any;

  public activeIndex: number | any;
  public i: number | any;

  constructor(
    private viewportScroller: ViewportScroller,
    public config: SettingsService
  ) {
    this.entityInitialization();
  }

  entityInitialization(): void {
    this.settingsSubscriber = this.config.currentSettings.subscribe(settings => this.currentSettings = settings);
  }

  ngOnInit(): void {
    this.activeIndex = 0;
    this.entityInitialization();
  }

  getCategoryButton(): any {
    this.ngOnInit();
  }

  onReachedIndex(index: number): any {
    this.activeIndex = index;
  }

  public onChooseCat(elementId: string): void {
    if (this.currentSettings !== undefined && !this.currentSettings.showCatalog) {
      this.currentSettings.showCatalog = !this.currentSettings.showCatalog;
      this.currentSettings.showOrder = !this.currentSettings.showOrder;
    }
    this.viewportScroller.setOffset([0, 142]);
    this.viewportScroller.scrollToAnchor(elementId);
  }

  ngOnDestroy(): void {
  }

}


