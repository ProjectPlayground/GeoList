export class Utils {
    static setPropsByObjs(toSet, ...args): void {
        for (let obj of args) {
            for (let prop in obj) {
                if (toSet.hasOwnProperty(prop)) {
                    console.log("dentro de la funcion ", obj, prop, toSet);
                    toSet[prop] = obj[prop];
                }
            }
        }
    }
}
export class Position {
    private lat: number;
    private lng: number;

    getLongitude(): number {
        return this.lng;
    }

    setLongitude(value: number) {
        this.lng = value;
    }

    getLatitude(): number {
        return this.lat;
    }

    setLatitude(value: number) {
        this.lat = value;
    }


    constructor(lat?: number, lon?: number) {
        this.setLatitude(lat);
        this.setLongitude(lon);
    }
    getPosition() {
        let position = {
            latitude: this.lat,
            longitude: this.lng
        }
        return position;
    }
    setPosition(pos: any): void {
        this.setLatitude(pos.latitude);
        this.setLongitude(pos.longitude);
    }
}

export class Item extends Position {
    private title: any;
    constructor(alias?: any, pos?: any, ) {
        super();
        this.title = alias;
    }

    setTitle(alias: any): void {
        this.title = alias;
    }
    getTitle(): any {
        return this.title;
    }

}

