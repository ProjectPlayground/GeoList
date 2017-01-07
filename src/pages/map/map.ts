import { Component, ElementRef, ViewChild } from '@angular/core';
import { Locations } from '../../providers/locations';
import { GoogleMaps } from '../../providers/google-maps';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from 'ionic-native';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  private position = {
    lat: 0,
    lng: 0
  }

  constructor(public navCtrl: NavController, public maps: GoogleMaps, public platform: Platform, public locations: Locations) {

  }

  ionViewDidLoad() {

    this.platform.ready().then(() => {
      let locationsLoaded;
      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
      Geolocation.getCurrentPosition().then((resp) => {

        this.position.lat = resp.coords.latitude;
        this.position.lng = resp.coords.longitude;
        locationsLoaded = this.locations.load(this.position);

        Promise.all([
          mapLoaded,
          locationsLoaded
        ]).then((result) => {

          let locations = result[1];
          if (locations !== undefined) {

            for (let location of locations) {
              this.maps.addMarker(location.lat, location.lng);
            }
          }

        });

      })


    });

  }

}