import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { AddItemPage } from '../add-item-page/add-item-page'
import { Data } from '../../providers/data';
import { Geo } from '../../providers/geolocation';
import { GoogleMaps } from '../../providers/google-maps';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  private items: any[] = new Array<any>();
  private numOfItems: number = 0;
  private hideListOfItems: boolean;
  private tryingToGetLocation: boolean;

  constructor(
    public maps: GoogleMaps,
    public navCtrl: NavController,
    public locations: Locations,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dataService: Data,
    public geo: Geo,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.hideListOfItems = true;
    this.tryingToGetLocation = false;
  }

  ngAfterViewInit() {
    let data = this.locations.data;
    if (data !== undefined) {
      data.map((item) => {
        this.items.push(item);
        this.numOfItems++;
      })
      this.hideListOfItems = false;
    } else {
      this.hideListOfItems = true;

    }
  }

  addLocation(): void {
    let addModal = this.modalCtrl.create(AddItemPage);
    addModal.onDidDismiss((item) => {
      if (item) {
        if (item.title === undefined) {
          item.title = "Ubicación " + this.numOfItems.toString();
        }
        this.locations.addItemToList(item).then((newList) => {
          this.items = newList;
          this.numOfItems = this.items.length;
          this.hideListOfItems = false;
        })
      }
    });

    addModal.present();

  }
  removeItem(index): void {
    this.locations.removeItemFromList(index).then((newList) => {
      this.items = newList;
      this.numOfItems = this.items.length;
      if (this.numOfItems == 0) {
        this.hideListOfItems = true;
      }
    })
  }
  presentActionSheet(item: any, index: number) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecciona una opción',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.removeItem(index);
          }
        },
        {
          text: 'Ir al destino',
          handler: () => {
            this.goToDestination(item);
          }
        },
        {
          text: 'Editar Alias',
          handler: () => {
            this.editAlias(item, index);
          }
        },
        {
          text: 'Regeolocalizar',
          handler: () => {
            this.editGeolocation(item, index);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present(actionSheet);
  }
  goToDestination(item: any): void {
    console.log(item);


    let endPosition = {
      lat: item.lat,
      lng: item.lng
    }
    let init = {
      lat: 0,
      lng: 0
    }
    this.geo.getGeolocation().then(currentPosition => {
      init.lat = currentPosition.getLatitude();
      init.lng = currentPosition.getLongitude();
      this.maps.calcRoute(init, endPosition);
    })
  }
  saveItem(item): void {
    this.items.push(item);
    this.hideListOfItems = false;
    this.dataService.save(this.items);
  }


  addItem(): void {
    let prompt = this.alertCtrl.create({
      title: 'Añadir Ubicación',
      inputs: [
        {
          name: 'title',
          placeholder: 'Titulo'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Guardar',
          handler: title => {
            this.tryingToGetLocation = true;
            this.geo.getGeolocation().then((ItemPosition) => {
              this.tryingToGetLocation = false;
              if (title.title === undefined) {
                title.title = "Ubicación " + this.numOfItems.toString();
              }
              let item = {
                title: title.title,
                lat: ItemPosition.getLatitude(),
                lng: ItemPosition.getLongitude()
              };
              this.locations.addItemToList(item).then((newList) => {
                this.items = newList;
                this.numOfItems = this.items.length;
                this.hideListOfItems = false;
              })
            })
          }
        }
      ]
    });
    prompt.present();

  }

  editGeolocation(item, index): void {
    this.tryingToGetLocation = true;
    this.geo.getGeolocation().then((location) => {
      this.tryingToGetLocation = false;
      item.lat = location.getLatitude();
      item.lng = location.getLongitude();
      console.log(item);
      this.locations.updateItemFromList(item, index).then((newList) => {
        this.items = newList;
      })
    })
  }
  editAlias(item, index): void {
    let prompt = this.alertCtrl.create({
      title: 'Modifica tu alias',
      inputs: [
        {
          name: 'title',
          placeholder: item.title
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Guardar',
          handler: item => {
            if (item) {
              if (item.title === undefined) {
                this.numOfItems++;
                item.title = "Ubicación " + this.numOfItems.toString();
              }
              this.items[index].title = item.title;
              this.locations.updateItemFromList(this.items[index], index)
                .then((newList) => {
                  this.items = newList;
                });
            }

          }
        }
      ]
    });
    prompt.present();

  }
}