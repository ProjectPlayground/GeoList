import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { AddItemPage } from '../add-item-page/add-item-page'
import { Data } from '../../providers/data';
import { ItemSliding } from 'ionic-angular';
import { Item } from '../clases/classes';



@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  private items: Item[] = new Array<Item>();
  private numOfItems: number = 0;
  private hideListOfItems: boolean;
  constructor(public navCtrl: NavController, public locations: Locations, public modalCtrl: ModalController, public dataService: Data) {
    this.hideListOfItems = true;
  }

  ngAfterViewInit() {
    let data = this.locations.data;
    console.log(data);

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
          item.title = "Localizacion " + this.numOfItems.toString();
        }
        this.locations.updateList(item).then((data) => {
          this.items = data;
          this.numOfItems = this.items.length;
          this.hideListOfItems = false;
        })
      }
    });

    addModal.present();

  }
  removeItem(index, slidingItem: ItemSliding): void {
    this.locations.removeItemFromList(index).then((data) => {
      this.items = data;
      this.numOfItems = this.items.length;
      if (this.numOfItems == 0) {
        this.hideListOfItems = true;
      }
      slidingItem.close();
    })
  }
  saveItem(item): void {
    this.items.push(item);
    this.hideListOfItems = false;
    this.dataService.save(this.items);
  }

  editItem(item, slidingItem: ItemSliding): void {
    let addModal = this.modalCtrl.create(AddItemPage, { "data": item });
    addModal.onDidDismiss((item) => {
      if (item) {
        if (item.title === undefined) {
          this.numOfItems++;
          item.title = "Localizacion " + this.numOfItems.toString();
        }
        this.saveItem(item);
      }
    });
    addModal.present();
    slidingItem.close();
  }
}