import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Position } from '../pages/clases/classes';
import { Data } from '../providers/data';
import { GoogleMaps } from '../providers/google-maps';
import { MyApp } from '../app/app.component';



@Injectable()
export class Locations {
  data: any;
  public usersLocation: Position;
  constructor(public http: Http, public storage: Storage, public dataService: Data, public maps: GoogleMaps) {
  }

  addItemToList(item: any): any {
    return new Promise(resolve => {
      if (!this.data) {
        this.data = [];
      }
      this.data.push(item);
      this.data = this.applyHaversine(this.data);
      this.dataService.save(this.data);
      this.data.sort((locationA, locationB) => {
        return locationA.distance - locationB.distance;
      });

      this.maps.addMarker(item);

      resolve(this.data);
    });

  }
  removeItemFromList(index: number): any {
    return new Promise(resolve => {
      this.data.splice(index, 1);
      this.maps.deleteMarkers();
      if (this.data.length > 0) {

        this.dataService.save(this.data);
        for (let location of this.data) {
          this.maps.addMarker(location);
        }
      } else {
        this.dataService.removeData();
      }
      resolve(this.data);
    })
  }

  updateItemFromList(newItem: any, index: number): any {
    return new Promise((resolve) => {

      this.data.map((item, ind) => {
        if (ind == index) {
          this.data[ind] = newItem;
        }
      })
      resolve(this.data);
    })
  }

  load(position: any) {

    this.usersLocation = new Position(position.lat, position.lng);
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {

      if (MyApp.mock) {
        this.http.get('assets/data/locations.json').map(res => res.json()).subscribe(data => {
          this.data = data.locations
          resolve(this.data);
          this.data = this.applyHaversine(this.data);
          this.data.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
          });
        });
      } else {
        this.dataService.getData().then((data) => {
          console.log(data);

          if (data !== null) {
            this.data = JSON.parse(data);
            this.data = this.applyHaversine(this.data);
            this.data.sort((locationA, locationB) => {
              return locationA.distance - locationB.distance;
            });
            resolve(this.data);
          } else {
            resolve(this.data);

          }
        });
      }

    });

  }

  applyHaversine(locations) {

    locations.map((location) => {
      if (MyApp.mock) {

        this.usersLocation.setLatitude(40.713744)
        this.usersLocation.setLongitude(-74.009056);

      }

      let placeLocation: Position = new Position(location.lat, location.lng);

      location.distance = this.getDistanceBetweenPoints(
        this.usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}