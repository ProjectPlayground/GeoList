import { Injectable } from '@angular/core';
import { Connectivity } from './connectivity';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';

declare var google;

@Injectable()
export class GoogleMaps {
  private static directionsDisplay;
  private static directionsService;
  static mapElement: any;
  static pleaseConnect: any;
  static map: any;
  static mapInitialised: boolean = false;
  static mapLoaded: any;
  static mapLoadedObserver: any;
  static markers: any = [];
  static apiKey: string;

  constructor(public connectivityService: Connectivity) {
    GoogleMaps.apiKey = 'AIzaSyC6eiMjdQx1sCxlEGOqnh1_jgBzWSa8U5M';
  }


  init(mapElement: any, pleaseConnect: any): Promise<any> {

    GoogleMaps.mapElement = mapElement;
    GoogleMaps.pleaseConnect = pleaseConnect;

    return this.loadGoogleMaps();

  }

  loadGoogleMaps(): Promise<any> {

    return new Promise((resolve) => {

      if (typeof google == "undefined" || typeof google.maps == "undefined") {

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if (this.connectivityService.isOnline()) {

          window['mapInit'] = () => {

            this.initMap().then(() => {
              resolve(true);
            });

            this.enableMap();
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if (GoogleMaps.apiKey) {
            script.src = 'http://maps.google.com/maps/api/js?key=' + GoogleMaps.apiKey + '&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      }
      else {

        if (this.connectivityService.isOnline()) {
          this.initMap();
          this.enableMap();
        }
        else {
          this.disableMap();
        }

      }

      this.addConnectivityListeners();

    });

  }

  initMap(): Promise<any> {

    GoogleMaps.mapInitialised = true;

    return new Promise((resolve) => {

      Geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let styleArray = [
          {
            featureType: 'all',
            stylers: [
              { saturation: -80 }
            ]
          }, {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
              { hue: '#00ffee' },
              { saturation: 50 }
            ]
          }, {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [
              { visibility: 'off' }
            ]
          }
        ];
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: styleArray
        }
        GoogleMaps.directionsDisplay = new google.maps.DirectionsRenderer;
        GoogleMaps.directionsService = new google.maps.DirectionsService;
        GoogleMaps.map = new google.maps.Map(GoogleMaps.mapElement, mapOptions);
        GoogleMaps.directionsDisplay.setMap(GoogleMaps.map);
        resolve(true);

      });

    });

  }

  calcRoute(start, end) {
    let obs = new Observable(observer => {
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      GoogleMaps.directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          GoogleMaps.directionsDisplay.setDirections(result);
          observer.next();
        }
      });
    })
    return obs;
  }

  disableMap(): void {

    if (GoogleMaps.pleaseConnect) {
      GoogleMaps.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if (GoogleMaps.pleaseConnect) {
      GoogleMaps.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    document.addEventListener('online', () => {

      console.log("online");

      setTimeout(() => {

        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!GoogleMaps.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    }, false);

    document.addEventListener('offline', () => {

      console.log("offline");

      this.disableMap();

    }, false);

  }

  addMarker(item): void {
    var infowindow = new google.maps.InfoWindow({
      content: item.title
    });
    let latLng = new google.maps.LatLng(item.lat, item.lng);

    let marker = new google.maps.Marker({
      map: GoogleMaps.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      title: item.title
    });
    marker.addListener('click', function () {
      infowindow.open(this.map, marker);
    });

    GoogleMaps.markers.push(marker);

  }
  setMapOnAll(map) {
    for (var i = 0; i < GoogleMaps.markers.length; i++) {
      GoogleMaps.markers[i].setMap(map);
    }
  }
  clearMarkers() {
    this.setMapOnAll(null);
  }
  deleteMarkers() {
    this.clearMarkers();
    GoogleMaps.markers = [];
  }


}