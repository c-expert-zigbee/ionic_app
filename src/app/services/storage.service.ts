import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(public storage: Storage) {}

  set(key: string, value: any) {
    return this.storage.set(key, value);
  }

  async get(key: string) {
    return this.storage.ready().then(() => {
      return this.storage.get(key);
    });
  }

  async remove(key: string) {
    return await this.storage.remove(key);
  }

  clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }
}
