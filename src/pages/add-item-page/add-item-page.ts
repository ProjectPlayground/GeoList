import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Geo } from '../../providers/geolocation';
import { Item } from '../../pages/clases/classes';

@Component({
  selector: 'page-add-item-page',
  templateUrl: 'add-item-page.html'
})
export class AddItemPage {

  private item: Item;
  private title: any;
  private tryingToGetLocation: boolean;
  constructor(public navCtrl: NavController, public view: ViewController, public geo: Geo, public params: NavParams) {
    console.log(this.params.get("data"));

    this.item = new Item();
    if (this.params.get("data")) {
      this.title = this.params.get("data").title;
    }
    this.tryingToGetLocation = false;
  }

  saveItem() {
    this.tryingToGetLocation = true;
    this.geo.getGeolocation().then((data) => {
      this.tryingToGetLocation = false;
      this.item.setTitle(this.title);
      this.item.setPosition(data.getLatitude(), data.getLongitude())
      this.close(this.item);
    }).catch((err) => {
      this.tryingToGetLocation = false;
      console.log(err);
    })

  }

  close(item: any) {
    this.view.dismiss(item);
  }

}