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
  private numOfItems: number = 1;
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
  goToDestination(item: any): void {
    51.5103807, -0.2329265
    let endPosition = {
      lat: 51.5103807,
      lng: -0.2329265
    }
    let init = {
      lat: 51.5081214,
      lng: 0.1537587
    }
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
          text: 'Ir al destino',
          handler: () => {
            this.goToDestination(item);
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.removeItem(index);
          }
        },
        {
          text: 'Editar Alias',
          handler: () => {
            this.editAlias(item, index);
          }
        },
        {
          text: 'Usar mi Ubicación actual',
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
              console.log(title);

              if (title.title === '') {
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