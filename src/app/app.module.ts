import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

//****  declarations ****//
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { AddItemPage } from '../pages/add-item-page/add-item-page'
import { ListPage } from '../pages/list/list';

//****  providers ****//

import { Storage } from '@ionic/storage';
import { Data } from '../providers/data';
import { Locations } from '../providers/locations';
import { GoogleMaps } from '../providers/google-maps';
import { Connectivity } from '../providers/connectivity';
import { Geo } from '../providers/geolocation';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    ListPage,
    AddItemPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    ListPage,
    AddItemPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Locations, GoogleMaps, Connectivity, Storage, Data, Geo]
})

export class AppModule { }
