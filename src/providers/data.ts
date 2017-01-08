import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class Data {

  constructor(public storage: Storage) {

  }
  removeData() {
    this.storage.remove('items');
  }
  getData() {
    return this.storage.get('items');
  }

  save(data) {
    let newData = JSON.stringify(data);
    this.storage.set('items', newData);
  }

}