import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavigationComponent } from './navigation/navigation.component';
import { MenuComponent } from './navigation/menu/menu.component';
import { OrderInfoComponent } from './navigation/order-info/order-info.component';

import { ContentComponent } from './content/content.component';
import { OrderComponent } from './content/order/order.component';
import { ItemsComponent } from './content/items/items.component';
import { ItemComponent } from './content/items/item/item.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';

import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { LoginComponent } from './login/login.component';

import { DmInterceptor } from './_helpers/dm.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ContentComponent,
    OrderComponent,
    ItemsComponent,
    OrderInfoComponent,
    ItemComponent,
    MenuComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatTabsModule,
    ListViewModule,
    ServiceWorkerModule.register(
      'ngsw-worker.js', {
        enabled: environment.production
      }
    ),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DmInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
