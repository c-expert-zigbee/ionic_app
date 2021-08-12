import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class SqlService {
  databaseName = 'app.expat';
  databaseObj: SQLiteObject;

  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(() => {
      this.createDB();
    });
  }

  // Create DB if not there
  private createDB() {
    this.sqlite
      .create({
        name: this.databaseName,
        location: 'default'
      })
      .then(
        (db: SQLiteObject) => {
          console.log('database created');
          this.databaseObj = db;
          this.prepareSqliteDatabase();
        },
        error => {
          console.error('Unable to open database', error);
        }
      );
  }

  private prepareSqliteDatabase() {
    const categoriesTable =
      'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'queryUrl TEXT UNIQUE, response TEXT, created_on DATE DEFAULT NULL)';
    const regionTable =
      'CREATE TABLE IF NOT EXISTS regions (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'queryUrl TEXT UNIQUE, response TEXT, created_on DATE DEFAULT NULL)';
    const highglightedRegionsTable =
      'CREATE TABLE IF NOT EXISTS highlightedRegions (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'queryUrl TEXT UNIQUE, response TEXT, created_on DATE DEFAULT NULL)';
    const listingTable =
      'CREATE TABLE IF NOT EXISTS listing (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'queryUrl TEXT UNIQUE, response TEXT, created_on DATE DEFAULT NULL)';
    const vehiclesTable =
      'CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY AUTOINCREMENT, vehicles TEXT, created_on DATE DEFAULT NULL)';
    const listingTableIndexing = 'CREATE INDEX IF NOT EXISTS listingUrlIndex ON listing (queryUrl)';
    const regionTableIndexing = 'CREATE INDEX IF NOT EXISTS regionUrlIndex ON regions (queryUrl)';
    const vehiclesTableIndexing = 'CREATE INDEX IF NOT EXISTS regionUrlIndex ON vehicles (vehicles)';
    this.initRunQuery(highglightedRegionsTable, []);
    this.initRunQuery(categoriesTable, []);
    this.initRunQuery(regionTable, []);
    this.initRunQuery(listingTable, []);
    this.initRunQuery(vehiclesTable, []);
    this.initRunQuery(listingTableIndexing, []);
    this.initRunQuery(regionTableIndexing, []);
    this.initRunQuery(vehiclesTableIndexing, []);
  }

  private initRunQuery(query: string, params: Array<String>): Promise<any> {
    console.log('query: ', query);
    return new Promise((resolve, reject) => {
      this.databaseObj.executeSql(query, params).then(
        data => {
          console.log('Table Created!', data);
          resolve(data);
        },
        error => {
          console.error('Unable to execute sql', error);
          reject(error);
        }
      );
    });
  }

  getCategories(queryUrl: string) {
    const query = 'SELECT * from categories WHERE queryUrl = ?';
    return this.initRunQuery(query, [queryUrl]);
  }

  saveCategories(queryUrl: string, response: any) {
    const query = 'INSERT OR REPLACE INTO categories (queryUrl, response, created_on) VALUES (?,?,?)';
    const dateNow = new Date();
    this.initRunQuery(query, [queryUrl, response, dateNow]);
  }

  getHighlightedRegions(queryUrl: string) {
    const query = 'SELECT * from highlightedRegions WHERE queryUrl = ?';
    return this.initRunQuery(query, [queryUrl]);
  }

  getRegion(queryUrl: string) {
    const query = 'SELECT * from regions WHERE queryUrl = ?';
    return this.initRunQuery(query, [queryUrl]);
  }

  saveRegion(queryUrl: string, response: any) {
    const query = 'INSERT OR REPLACE INTO regions (queryUrl, response, created_on) VALUES (?,?,?)';
    const dateNow = new Date();
    this.initRunQuery(query, [queryUrl, response, dateNow]);
  }
}
