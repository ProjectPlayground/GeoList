import { Geolocation } from 'ionic-native';
import { Injectable } from '@angular/core';
import { Position } from '../pages/clases/classes';

@Injectable()
export class Geo {

    getGeolocation() {
        var promise = new Promise<Position>(function (resolve, reject) {
            Geolocation.getCurrentPosition().then((resp) => {
                let currentPosition: Position;
                currentPosition = new Position(resp.coords.latitude, resp.coords.longitude);
                resolve(currentPosition);
            }).catch((err) => {
                reject(err);
            })
        })
        return promise;
    }

}