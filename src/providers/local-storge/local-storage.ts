import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const ls = localStorage;

/*
  Generated class for the LocalStorgeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalStorgeProvider {

  constructor(public http: HttpClient) {
    console.log('Hello LocalStorgeProvider Provider');
  }
  public get<T>(key: string): T {
    return JSON.parse(ls.getItem(key)) as T;
  }

  public getList<T>(key: string) {
    const before = ls.getItem(key);
    return before ? (JSON.parse(before) as T[]) : [];
  }

  public set(key: string, value: any): void {
    if (!value && value === undefined) { 
      ls.setItem(key, null);
      return; 
    }
    const arr = JSON.stringify(value);
    ls.setItem(key, arr);
  }

  public clear(key: string) {
    this.set(key, null);
  }
}
